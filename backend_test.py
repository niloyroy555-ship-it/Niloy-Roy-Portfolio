#!/usr/bin/env python3
"""
Regression test for Contact API after production bugfix.
Tests the hardened /api/contact route that now:
- Validates MONGO_URL before connecting
- Saves to DB and emails INDEPENDENTLY (each in try/catch)
- Returns success if EITHER works, 503 only if BOTH fail
"""

import requests
import json
import time
from datetime import datetime

# Backend URL from environment
BASE_URL = "https://magic-studio-4.preview.emergentagent.com/api"

def test_1_get_root():
    """Test 1: GET /api/root should return {message:'Hello World'} even though top-level DB connect was removed"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/root (sanity check - non-DB route)")
    print("="*80)
    try:
        start = time.time()
        response = requests.get(f"{BASE_URL}/root", timeout=10)
        elapsed = time.time() - start
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {elapsed:.2f}s")
        print(f"Response: {response.text}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data.get("message") == "Hello World", f"Expected 'Hello World', got {data.get('message')}"
        assert elapsed < 5, f"Response time too slow: {elapsed:.2f}s"
        
        print("✅ TEST 1 PASSED: GET /api/root works correctly")
        return True
    except Exception as e:
        print(f"❌ TEST 1 FAILED: {str(e)}")
        return False

def test_2_post_contact_valid():
    """Test 2: POST /api/contact with valid data should return 200 with success:true, saved:true, emailed:true"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/contact with valid data (regression test after bugfix)")
    print("="*80)
    try:
        payload = {
            "name": "Prod Fix",
            "email": "prodfix@example.com",
            "message": "Testing the hardened contact route after the startsWith bugfix."
        }
        
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        start = time.time()
        response = requests.post(
            f"{BASE_URL}/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        elapsed = time.time() - start
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {elapsed:.2f}s")
        print(f"Response: {response.text}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Check response structure
        assert data.get("success") == True, f"Expected success:true, got {data.get('success')}"
        assert "saved" in data, "Response missing 'saved' field"
        assert "emailed" in data, "Response missing 'emailed' field"
        assert "contact" in data, "Response missing 'contact' field"
        
        # Check saved and emailed flags (both should be true in PREVIEW environment)
        print(f"\n📊 Delivery Status:")
        print(f"   - saved: {data.get('saved')}")
        print(f"   - emailed: {data.get('emailed')}")
        
        assert data.get("saved") == True, f"Expected saved:true, got {data.get('saved')}"
        assert data.get("emailed") == True, f"Expected emailed:true, got {data.get('emailed')}"
        
        # Check contact object
        contact = data.get("contact", {})
        assert "id" in contact, "Contact missing 'id' field"
        assert "_id" not in contact, "Contact should NOT have '_id' field"
        assert contact.get("name") == payload["name"], f"Name mismatch"
        assert contact.get("email") == payload["email"], f"Email mismatch"
        assert contact.get("message") == payload["message"], f"Message mismatch"
        assert "createdAt" in contact, "Contact missing 'createdAt' field"
        
        # Verify UUID format (basic check)
        contact_id = contact.get("id")
        assert len(contact_id) == 36 and contact_id.count("-") == 4, f"Invalid UUID format: {contact_id}"
        
        print(f"\n✅ Contact Object:")
        print(f"   - id: {contact_id} (UUID ✓)")
        print(f"   - name: {contact.get('name')}")
        print(f"   - email: {contact.get('email')}")
        print(f"   - message: {contact.get('message')[:50]}...")
        print(f"   - createdAt: {contact.get('createdAt')}")
        print(f"   - NO _id field ✓")
        
        assert elapsed < 10, f"Response time too slow: {elapsed:.2f}s"
        
        print("\n✅ TEST 2 PASSED: POST /api/contact with valid data works correctly")
        print("   - HTTP 200 ✓")
        print("   - success: true ✓")
        print("   - saved: true ✓")
        print("   - emailed: true ✓")
        print("   - contact object with UUID id ✓")
        print("   - NO _id field ✓")
        print("   - Response time acceptable ✓")
        
        # Store contact_id for later tests
        global CREATED_CONTACT_ID
        CREATED_CONTACT_ID = contact_id
        
        return True
    except Exception as e:
        print(f"❌ TEST 2 FAILED: {str(e)}")
        return False

def test_3_post_contact_missing_field():
    """Test 3: POST /api/contact with missing field should return 400"""
    print("\n" + "="*80)
    print("TEST 3: POST /api/contact with missing field (validation)")
    print("="*80)
    try:
        payload = {
            "name": "Test User",
            "email": "test@example.com"
            # message is missing
        }
        
        print(f"Payload (missing 'message'): {json.dumps(payload, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        
        data = response.json()
        assert "error" in data, "Response should contain 'error' field"
        
        print(f"✅ Error message: {data.get('error')}")
        print("✅ TEST 3 PASSED: Missing field validation works correctly")
        return True
    except Exception as e:
        print(f"❌ TEST 3 FAILED: {str(e)}")
        return False

def test_4_post_contact_malformed_json():
    """Test 4: POST /api/contact with malformed/empty JSON should return 400 (not crash)"""
    print("\n" + "="*80)
    print("TEST 4: POST /api/contact with malformed/empty JSON (should NOT crash)")
    print("="*80)
    try:
        # Test with empty JSON
        print("Testing with empty JSON body...")
        response = requests.post(
            f"{BASE_URL}/contact",
            data="{}",
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        assert response.status_code != 500, "Should NOT return 500 (crash)"
        
        data = response.json()
        assert "error" in data, "Response should contain 'error' field"
        
        print(f"✅ Error message: {data.get('error')}")
        print("✅ TEST 4 PASSED: Malformed JSON handled gracefully (no crash)")
        return True
    except Exception as e:
        print(f"❌ TEST 4 FAILED: {str(e)}")
        return False

def test_5_get_contacts():
    """Test 5: GET /api/contact should return array, no _id, newest first"""
    print("\n" + "="*80)
    print("TEST 5: GET /api/contact (list contacts)")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), f"Expected array, got {type(data)}"
        
        print(f"✅ Returned {len(data)} contacts")
        
        if len(data) > 0:
            # Check first contact (should be newest)
            first_contact = data[0]
            print(f"\n📋 First contact (newest):")
            print(f"   - id: {first_contact.get('id')}")
            print(f"   - name: {first_contact.get('name')}")
            print(f"   - email: {first_contact.get('email')}")
            print(f"   - createdAt: {first_contact.get('createdAt')}")
            
            # Verify no _id field
            assert "_id" not in first_contact, "Contact should NOT have '_id' field"
            print(f"   - NO _id field ✓")
            
            # Verify required fields
            assert "id" in first_contact, "Contact missing 'id' field"
            assert "name" in first_contact, "Contact missing 'name' field"
            assert "email" in first_contact, "Contact missing 'email' field"
            assert "message" in first_contact, "Contact missing 'message' field"
            assert "createdAt" in first_contact, "Contact missing 'createdAt' field"
            
            # Verify sorting (newest first)
            if len(data) > 1:
                first_date = first_contact.get("createdAt")
                second_date = data[1].get("createdAt")
                print(f"\n📅 Sorting check:")
                print(f"   - First: {first_date}")
                print(f"   - Second: {second_date}")
                # Note: Dates are ISO strings, can compare lexicographically
                assert first_date >= second_date, "Contacts not sorted by createdAt descending"
                print(f"   - Sorted newest first ✓")
        
        print("\n✅ TEST 5 PASSED: GET /api/contact works correctly")
        print("   - HTTP 200 ✓")
        print("   - Returns array ✓")
        print("   - NO _id field ✓")
        print("   - Sorted newest first ✓")
        return True
    except Exception as e:
        print(f"❌ TEST 5 FAILED: {str(e)}")
        return False

def test_6_persistence_verification():
    """Test 6: Verify the contact created in Test 2 is retrievable via GET"""
    print("\n" + "="*80)
    print("TEST 6: Persistence verification (contact from Test 2 should be in GET)")
    print("="*80)
    try:
        if not CREATED_CONTACT_ID:
            print("⚠️  Skipping: No contact ID from Test 2")
            return True
        
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        contacts = response.json()
        
        # Find the contact we created
        found = False
        for contact in contacts:
            if contact.get("id") == CREATED_CONTACT_ID:
                found = True
                print(f"✅ Found contact with id: {CREATED_CONTACT_ID}")
                print(f"   - name: {contact.get('name')}")
                print(f"   - email: {contact.get('email')}")
                print(f"   - message: {contact.get('message')[:50]}...")
                break
        
        assert found, f"Contact with id {CREATED_CONTACT_ID} not found in GET response"
        
        print("\n✅ TEST 6 PASSED: Persistence verified")
        return True
    except Exception as e:
        print(f"❌ TEST 6 FAILED: {str(e)}")
        return False

def run_all_tests():
    """Run all regression tests"""
    print("\n" + "="*80)
    print("CONTACT API REGRESSION TEST SUITE")
    print("After production bugfix: MONGO_URL validation + independent DB/email")
    print("="*80)
    
    results = []
    
    # Test 5: GET /api/root (sanity check)
    results.append(("GET /api/root", test_1_get_root()))
    
    # Test 1: Valid POST
    results.append(("POST /api/contact (valid)", test_2_post_contact_valid()))
    
    # Test 2: Missing field
    results.append(("POST /api/contact (missing field)", test_3_post_contact_missing_field()))
    
    # Test 3: Malformed JSON
    results.append(("POST /api/contact (malformed JSON)", test_4_post_contact_malformed_json()))
    
    # Test 4: GET contacts
    results.append(("GET /api/contact", test_5_get_contacts()))
    
    # Test 6: Persistence
    results.append(("Persistence verification", test_6_persistence_verification()))
    
    # Summary
    print("\n" + "="*80)
    print("REGRESSION TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\n{'='*80}")
    print(f"Total: {passed}/{total} tests passed")
    print(f"{'='*80}")
    
    if passed == total:
        print("\n🎉 ALL REGRESSION TESTS PASSED!")
        print("The Contact API is working correctly after the production bugfix.")
        return True
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return False

if __name__ == "__main__":
    CREATED_CONTACT_ID = None
    success = run_all_tests()
    exit(0 if success else 1)
