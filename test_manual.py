"""
Manual testing script for the /summaries endpoint.
Run this after starting the FastAPI server with: uvicorn main:app --reload
"""

import requests

BASE_URL = "http://localhost:8000"


def test_summaries(text, description):
    """Test the /summaries endpoint with given text."""
    print(f"\n{'='*60}")
    print(f"Test: {description}")
    print(f"{'='*60}")
    print(f"Input text: {text}")
    print(f"Input word count: {len(text.split())}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/summaries",
            json={"text": text},
            timeout=5
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            summary = data["summary"]
            word_count = len(summary.split())
            
            print(f"✅ Success!")
            print(f"Summary: {summary}")
            print(f"Summary word count: {word_count}")
            print(f"API word_count field: {data['word_count']}")
            print(f"Timestamp: {data['timestamp']}")
            
            # Verify word count
            if len(text.split()) > 10:
                if word_count == 10:
                    print("✅ Correct: Returned exactly 10 words as expected")
                else:
                    print(f"❌ Error: Expected 10 words, got {word_count}")
            elif len(text.split()) == 10:
                if word_count == 10:
                    print("✅ Correct: Returned all 10 words")
                else:
                    print(f"❌ Error: Expected 10 words, got {word_count}")
            else:
                if word_count == len(text.split()):
                    print(f"✅ Correct: Returned all {word_count} words (less than 10)")
                else:
                    print(f"❌ Error: Expected {len(text.split())} words, got {word_count}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to server.")
        print("   Make sure the server is running: uvicorn main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")


def main():
    """Run all test cases."""
    print("\n" + "="*60)
    print("Testing POST /summaries Endpoint")
    print("="*60)
    
    # Test 1: More than 10 words
    test_summaries(
        "This is a test sentence with exactly fifteen words in total for testing purposes",
        "More than 10 words (should return exactly 10)"
    )
    
    # Test 2: Exactly 10 words
    test_summaries(
        "one two three four five six seven eight nine ten",
        "Exactly 10 words (should return all 10)"
    )
    
    # Test 3: Less than 10 words
    test_summaries(
        "Hello world from the API",
        "Less than 10 words (should return all words)"
    )
    
    # Test 4: Long paragraph
    test_summaries(
        "The quick brown fox jumps over the lazy dog and then runs through the forest to find food and water for survival in the wilderness during the cold winter months when resources are scarce and animals must adapt",
        "Long paragraph (should return first 10 words)"
    )
    
    # Test 5: Multiple spaces
    test_summaries(
        "  word1   word2    word3  word4  word5  word6  word7  word8  word9  word10  word11  word12  ",
        "Multiple whitespaces (should handle correctly)"
    )
    
    # Test 6: Single word
    test_summaries(
        "Hello",
        "Single word"
    )
    
    # Test 7: Empty string (should fail)
    print(f"\n{'='*60}")
    print("Test: Empty string (should return validation error)")
    print(f"{'='*60}")
    try:
        response = requests.post(
            f"{BASE_URL}/summaries",
            json={"text": ""},
            timeout=5
        )
        print(f"Status Code: {response.status_code}")
        if response.status_code == 422:
            print("✅ Correct: Validation error as expected")
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "="*60)
    print("Testing Complete!")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()

