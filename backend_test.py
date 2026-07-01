#!/usr/bin/env python3
"""
Backend API Test Suite for Niloy Roy Portfolio - Contact API with Resend Integration
Tests the Contact form endpoints: POST /api/contact and GET /api/contact
Now includes testing for Resend email integration (emailed field)
"""

import requests
import json
import os
import time
from datetime import datetime

# Base URL from environment
BASE_URL = os.environ.get('NEXT_PUBLIC_BASE_URL', 'https://magic-studio-4.preview.emergentagent.com').rstrip('/') + '/api'

def test_root_endpoint():
    """Test GET /api/root - sanity check"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/root (Sanity Check)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/root", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ PASS: Root endpoint returns correct message")
                return True
            else:
                print(f"❌ FAIL: Expected message 'Hello World', got {data}")
                return False
        else:
            print(f"❌ FAIL: Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def test_post_contact_valid():
    """Test POST /api/contact with valid data - NOW WITH RESEND EMAIL INTEGRATION"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/contact with valid data (Resend email integration)")
    print("="*80)
    
    payload = {
        "name": "Jane Client",
        "email": "jane@example.com",
        "message": "Hi Niloy, I would love to work with you on a brand film."
    }
    
    try:
        # Measure response time to ensure Resend call completes within reasonable time
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=15  # Increased timeout for Resend API call
        )
        
        response_time = time.time() - start_time
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {response_time:.2f} seconds")
        print(f"Response: {response.text}")
        
        if response.status_code != 200:
            print(f"❌ FAIL: Expected status 200, got {response.status_code}")
            return False, None, None
        
        data = response.json()
        
        # Check response structure
        if not data.get("success"):
            print(f"❌ FAIL: Expected success=true, got {data.get('success')}")
            return False, None, None
        
        # *** NEW: Check for 'emailed' field (Resend integration) ***
        if "emailed" not in data:
            print("❌ FAIL: Missing 'emailed' field in response (Resend integration)")
            return False, None, None
        
        emailed = data.get("emailed")
        print(f"\n📧 RESEND EMAIL STATUS: emailed = {emailed}")
        
        if not isinstance(emailed, bool):
            print(f"❌ FAIL: 'emailed' field should be boolean, got {type(emailed)}")
            return False, None, None
        
        # If emailed is false, check for error details
        if not emailed:
            print("⚠️  WARNING: Email was not sent (emailed=false)")
            if "error" in data:
                print(f"   Error detail: {data.get('error')}")
            else:
                print("   No error detail in response (check server logs)")
        else:
            print("✅ Email successfully sent via Resend")
        
        # Check response time is reasonable (Resend should complete within a few seconds)
        if response_time > 10:
            print(f"⚠️  WARNING: Response took {response_time:.2f}s (longer than expected)")
        else:
            print(f"✅ Response time acceptable: {response_time:.2f}s")
        
        contact = data.get("contact")
        if not contact:
            print("❌ FAIL: No contact object in response")
            return False, None, None
        
        # Verify required fields
        required_fields = ["id", "name", "email", "message", "createdAt"]
        for field in required_fields:
            if field not in contact:
                print(f"❌ FAIL: Missing required field '{field}' in contact")
                return False, None, None
        
        # Verify NO _id field (MongoDB field should be stripped)
        if "_id" in contact:
            print("❌ FAIL: Response contains MongoDB '_id' field (should be stripped)")
            return False, None, None
        
        # Verify id is a UUID (36 characters with hyphens)
        contact_id = contact.get("id")
        if not isinstance(contact_id, str) or len(contact_id) != 36 or contact_id.count("-") != 4:
            print(f"❌ FAIL: 'id' is not a valid UUID format: {contact_id}")
            return False, None, None
        
        # Verify data matches
        if contact.get("name") != payload["name"]:
            print(f"❌ FAIL: Name mismatch. Expected '{payload['name']}', got '{contact.get('name')}'")
            return False, None, None
        
        if contact.get("email") != payload["email"]:
            print(f"❌ FAIL: Email mismatch. Expected '{payload['email']}', got '{contact.get('email')}'")
            return False, None, None
        
        if contact.get("message") != payload["message"]:
            print(f"❌ FAIL: Message mismatch")
            return False, None, None
        
        print("\n✅ PASS: Valid POST request successful with Resend integration")
        print(f"   - Contact ID (UUID): {contact_id}")
        print(f"   - No '_id' field: ✓")
        print(f"   - All required fields present: ✓")
        print(f"   - 'emailed' field present: ✓")
        print(f"   - Email sent: {emailed}")
        print(f"   - Response time: {response_time:.2f}s")
        return True, contact_id, emailed
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False, None, None


def test_post_contact_missing_field():
    """Test POST /api/contact with missing required field"""
    print("\n" + "="*80)
    print("TEST 3: POST /api/contact with missing 'message' field")
    print("="*80)
    
    payload = {
        "name": "John Doe",
        "email": "john@example.com"
        # message is missing
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if "error" in data:
                print("✅ PASS: Returns 400 with error message for missing field")
                return True
            else:
                print("❌ FAIL: Status 400 but no error message in response")
                return False
        else:
            print(f"❌ FAIL: Expected status 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def test_post_contact_empty_strings():
    """Test POST /api/contact with empty string values"""
    print("\n" + "="*80)
    print("TEST 4: POST /api/contact with empty string values")
    print("="*80)
    
    payload = {
        "name": "",
        "email": "test@example.com",
        "message": "Test message"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 400:
            data = response.json()
            if "error" in data:
                print("✅ PASS: Returns 400 with error message for empty string")
                return True
            else:
                print("❌ FAIL: Status 400 but no error message in response")
                return False
        else:
            print(f"❌ FAIL: Expected status 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def test_get_contacts():
    """Test GET /api/contact - retrieve all contacts"""
    print("\n" + "="*80)
    print("TEST 5: GET /api/contact (retrieve contacts)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAIL: Expected status 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if not isinstance(data, list):
            print(f"❌ FAIL: Expected array response, got {type(data)}")
            return False
        
        print(f"Response: Retrieved {len(data)} contacts")
        
        if len(data) == 0:
            print("⚠️  WARNING: No contacts in database (but endpoint works)")
            return True
        
        # Check first contact structure
        first_contact = data[0]
        required_fields = ["id", "name", "email", "message", "createdAt"]
        
        for field in required_fields:
            if field not in first_contact:
                print(f"❌ FAIL: Missing required field '{field}' in contact")
                return False
        
        # Verify NO _id field
        if "_id" in first_contact:
            print("❌ FAIL: Response contains MongoDB '_id' field (should be stripped)")
            return False
        
        # Verify sorting (most recent first - descending createdAt)
        if len(data) > 1:
            first_date = data[0].get("createdAt")
            second_date = data[1].get("createdAt")
            if first_date < second_date:
                print(f"❌ FAIL: Contacts not sorted by createdAt descending")
                print(f"   First: {first_date}, Second: {second_date}")
                return False
            else:
                print("✅ Sorting verified: Most recent first (createdAt descending)")
        
        print("✅ PASS: GET /api/contact successful")
        print(f"   - Returns array: ✓")
        print(f"   - All required fields present: ✓")
        print(f"   - No '_id' field: ✓")
        print(f"   - Sorted by createdAt descending: ✓")
        
        # Print sample contact
        print(f"\nSample contact:")
        print(f"   ID: {first_contact.get('id')}")
        print(f"   Name: {first_contact.get('name')}")
        print(f"   Email: {first_contact.get('email')}")
        
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def test_persistence(contact_id):
    """Test that posted contact persists and is retrievable via GET"""
    print("\n" + "="*80)
    print("TEST 6: Verify persistence (contact retrievable after POST)")
    print("="*80)
    
    if not contact_id:
        print("⚠️  SKIP: No contact_id from previous POST test")
        return None
    
    try:
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        
        if response.status_code != 200:
            print(f"❌ FAIL: GET request failed with status {response.status_code}")
            return False
        
        contacts = response.json()
        
        # Find the contact we created
        found = False
        for contact in contacts:
            if contact.get("id") == contact_id:
                found = True
                print(f"✅ PASS: Contact with ID {contact_id} found in database")
                print(f"   Name: {contact.get('name')}")
                print(f"   Email: {contact.get('email')}")
                break
        
        if not found:
            print(f"❌ FAIL: Contact with ID {contact_id} not found in GET response")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("BACKEND API TEST SUITE - NILOY ROY PORTFOLIO")
    print("Testing Contact API Endpoints with Resend Email Integration")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {}
    contact_id = None
    emailed_status = None
    
    # Test 1: Root endpoint (sanity check)
    results["root_endpoint"] = test_root_endpoint()
    
    # Test 2: POST with valid data (NOW WITH RESEND EMAIL CHECK)
    post_result, contact_id, emailed_status = test_post_contact_valid()
    results["post_valid"] = post_result
    
    # Test 3: POST with missing field
    results["post_missing_field"] = test_post_contact_missing_field()
    
    # Test 4: POST with empty strings
    results["post_empty_strings"] = test_post_contact_empty_strings()
    
    # Test 5: GET contacts
    results["get_contacts"] = test_get_contacts()
    
    # Test 6: Verify persistence
    persistence_result = test_persistence(contact_id)
    if persistence_result is not None:
        results["persistence"] = persistence_result
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for v in results.values() if v is True)
    failed = sum(1 for v in results.values() if v is False)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    # Report Resend email status
    if emailed_status is not None:
        print(f"\n📧 RESEND EMAIL INTEGRATION STATUS: emailed = {emailed_status}")
        if emailed_status:
            print("   ✅ Email successfully sent to niloyroy555@gmail.com via Resend")
        else:
            print("   ⚠️  Email was not sent (check RESEND_API_KEY and server logs)")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed")
        return 1


if __name__ == "__main__":
    exit(main())
