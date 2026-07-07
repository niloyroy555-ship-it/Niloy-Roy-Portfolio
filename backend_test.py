#!/usr/bin/env python3
"""
Test suite for Contact API - Email-Only Implementation (NO MongoDB)
Tests the /api/contact route that now:
- Sends email ONLY via Resend (no database at all)
- Returns contact object with UUID but doesn't save to DB
- GET /api/contact and /api/status endpoints were intentionally REMOVED (404 expected)
"""

import requests
import json
import time
from datetime import datetime

# Backend URL from environment
BASE_URL = "https://magic-studio-4.preview.emergentagent.com/api"

def test_1_get_root():
    """Test 1: GET /api/root should return {message:'Hello World'}"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/root (sanity check)")
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
    """Test 2: POST /api/contact with valid data should return 200 with success:true, emailed:true"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/contact with valid data (email-only, no MongoDB)")
    print("="*80)
    try:
        payload = {
            "name": "Email Only",
            "email": "emailonly@example.com",
            "message": "Testing the email-only contact form with no MongoDB."
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
        assert "emailed" in data, "Response missing 'emailed' field"
        assert "contact" in data, "Response missing 'contact' field"
        
        # Check that there's NO "saved" field (since we're not using MongoDB)
        assert "saved" not in data, "Response should NOT have 'saved' field (no MongoDB)"
        
        # Check emailed flag
        print(f"\n📊 Delivery Status:")
        print(f"   - emailed: {data.get('emailed')}")
        
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
        print(f"   - NO saved field ✓ (email-only, no DB)")
        
        assert elapsed < 10, f"Response time too slow: {elapsed:.2f}s"
        
        print("\n✅ TEST 2 PASSED: POST /api/contact with valid data works correctly")
        print("   - HTTP 200 ✓")
        print("   - success: true ✓")
        print("   - emailed: true ✓")
        print("   - contact object with UUID id ✓")
        print("   - NO _id field ✓")
        print("   - NO saved field ✓")
        print("   - Response time acceptable ✓")
        print("   - Resend email was accepted ✓")
        
        return True
    except Exception as e:
        print(f"❌ TEST 2 FAILED: {str(e)}")
        return False

def test_3_post_contact_missing_field():
    """Test 3: POST /api/contact with missing field should return 400 with specific error"""
    print("\n" + "="*80)
    print("TEST 3: POST /api/contact with missing field (omit message)")
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
        
        error_msg = data.get("error")
        expected_error = "name, email and message are required"
        assert error_msg == expected_error, f"Expected error '{expected_error}', got '{error_msg}'"
        
        print(f"✅ Error message: {error_msg}")
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

def test_5_get_contact_removed():
    """Test 5: GET /api/contact should return 404 (endpoint intentionally removed)"""
    print("\n" + "="*80)
    print("TEST 5: GET /api/contact (should return 404 - endpoint removed)")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        data = response.json()
        assert "error" in data, "Response should contain 'error' field"
        
        print(f"✅ Error message: {data.get('error')}")
        print("✅ TEST 5 PASSED: GET /api/contact correctly returns 404 (endpoint removed as expected)")
        return True
    except Exception as e:
        print(f"❌ TEST 5 FAILED: {str(e)}")
        return False

def test_6_get_status_removed():
    """Test 6: GET /api/status should return 404 (endpoint intentionally removed)"""
    print("\n" + "="*80)
    print("TEST 6: GET /api/status (should return 404 - endpoint removed)")
    print("="*80)
    try:
        response = requests.get(f"{BASE_URL}/status", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        data = response.json()
        assert "error" in data, "Response should contain 'error' field"
        
        print(f"✅ Error message: {data.get('error')}")
        print("✅ TEST 6 PASSED: GET /api/status correctly returns 404 (endpoint removed as expected)")
        return True
    except Exception as e:
        print(f"❌ TEST 6 FAILED: {str(e)}")
        return False

def test_7_no_mongodb_errors():
    """Test 7: Verify no MongoDB connection errors in responses"""
    print("\n" + "="*80)
    print("TEST 7: Verify NO MongoDB connections/errors")
    print("="*80)
    try:
        # Make a few requests and check for MongoDB-related errors
        print("Making multiple requests to check for MongoDB errors...")
        
        # Test GET /api/root
        response1 = requests.get(f"{BASE_URL}/root", timeout=10)
        assert response1.status_code == 200, "GET /api/root failed"
        data1 = response1.json()
        # Check for MongoDB error patterns (not in user-submitted data)
        assert "error" not in data1 or "mongo" not in str(data1.get("error", "")).lower(), "MongoDB error found"
        
        # Test POST /api/contact
        payload = {
            "name": "Clean Test",
            "email": "cleantest@example.com",
            "message": "Testing API without database dependencies"
        }
        response2 = requests.post(
            f"{BASE_URL}/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=15
        )
        assert response2.status_code == 200, "POST /api/contact failed"
        data2 = response2.json()
        # Check that response doesn't contain MongoDB error fields
        assert "error" not in data2, "Error field found in successful response"
        assert data2.get("success") == True, "Success should be true"
        assert data2.get("emailed") == True, "Emailed should be true"
        
        # Test GET /api/contact (should 404, not MongoDB error)
        response3 = requests.get(f"{BASE_URL}/contact", timeout=10)
        assert response3.status_code == 404, "GET /api/contact should return 404"
        data3 = response3.json()
        error_msg = data3.get("error", "").lower()
        # Should be a route not found error, not a MongoDB error
        assert "route" in error_msg and "not found" in error_msg, "Should be route not found error"
        assert "mongo" not in error_msg, "MongoDB reference in error message"
        assert "database" not in error_msg, "Database reference in error message"
        assert "connection" not in error_msg, "Connection error in message"
        
        print("✅ No MongoDB connections or errors detected")
        print("✅ All responses are clean (no MongoDB errors)")
        print("✅ All errors are route-level, not database-level")
        print("✅ TEST 7 PASSED: Confirmed NO MongoDB usage")
        return True
    except Exception as e:
        print(f"❌ TEST 7 FAILED: {str(e)}")
        return False

def run_all_tests():
    """Run all tests for email-only Contact API"""
    print("\n" + "="*80)
    print("CONTACT API TEST SUITE - EMAIL-ONLY (NO MongoDB)")
    print("Testing /api/contact route with Resend email integration only")
    print("="*80)
    
    results = []
    
    # Test 1: GET /api/root (sanity check)
    results.append(("GET /api/root", test_1_get_root()))
    
    # Test 2: Valid POST
    results.append(("POST /api/contact (valid)", test_2_post_contact_valid()))
    
    # Test 3: Missing field
    results.append(("POST /api/contact (missing field)", test_3_post_contact_missing_field()))
    
    # Test 4: Malformed JSON
    results.append(("POST /api/contact (malformed JSON)", test_4_post_contact_malformed_json()))
    
    # Test 5: GET /api/contact (should 404)
    results.append(("GET /api/contact (404 expected)", test_5_get_contact_removed()))
    
    # Test 6: GET /api/status (should 404)
    results.append(("GET /api/status (404 expected)", test_6_get_status_removed()))
    
    # Test 7: No MongoDB errors
    results.append(("No MongoDB errors", test_7_no_mongodb_errors()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
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
        print("\n🎉 ALL TESTS PASSED!")
        print("The Contact API (email-only, no MongoDB) is working correctly.")
        return True
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
