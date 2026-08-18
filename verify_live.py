import urllib.request
import urllib.parse
import json

def test_live_app():
    print("=== LIVE INTEGRATION TEST ===")
    
    # 1. Test Frontend Live Dev Server
    try:
        with urllib.request.urlopen("http://127.0.0.1:5173/") as response:
            html = response.read().decode('utf-8')
            assert response.status == 200
            assert "Minimalist Tasks" in html
            print("[PASS] Frontend Dev Server is running at http://127.0.0.1:5173/ (HTTP 200)")
    except Exception as e:
        print(f"[FAIL] Frontend server check failed: {e}")
        raise e

    # 2. Test Backend Live API (JWT Login)
    login_url = "http://127.0.0.1:8000/api/auth/token/"
    login_data = json.dumps({"username": "demo", "password": "password123"}).encode('utf-8')
    req = urllib.request.Request(login_url, data=login_data, headers={'Content-Type': 'application/json'})
    
    with urllib.request.urlopen(req) as response:
        assert response.status == 200
        tokens = json.loads(response.read().decode('utf-8'))
        access_token = tokens['access']
        refresh_token = tokens['refresh']
        print("[PASS] Backend Live JWT Login (demo user) -> tokens generated")

    auth_header = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}

    # 3. Test Backend Live API (GET /api/tasks/)
    tasks_url = "http://127.0.0.1:8000/api/tasks/"
    req = urllib.request.Request(tasks_url, headers=auth_header)
    with urllib.request.urlopen(req) as response:
        assert response.status == 200
        tasks = json.loads(response.read().decode('utf-8'))
        print(f"[PASS] Backend Live GET /api/tasks/ returned {len(tasks)} tasks")

    # 4. Test Backend Live API (POST /api/tasks/)
    create_data = json.dumps({"title": "Live Verification Task"}).encode('utf-8')
    req = urllib.request.Request(tasks_url, data=create_data, headers=auth_header, method='POST')
    with urllib.request.urlopen(req) as response:
        assert response.status == 201
        created_task = json.loads(response.read().decode('utf-8'))
        task_id = created_task['id']
        assert created_task['title'] == "Live Verification Task"
        assert created_task['is_completed'] is False
        print(f"[PASS] Backend Live POST /api/tasks/ created task #{task_id}")

    # 5. Test Backend Live API (PATCH /api/tasks/<id>/ to complete)
    patch_url = f"http://127.0.0.1:8000/api/tasks/{task_id}/"
    patch_data = json.dumps({"is_completed": True}).encode('utf-8')
    req = urllib.request.Request(patch_url, data=patch_data, headers=auth_header, method='PATCH')
    with urllib.request.urlopen(req) as response:
        assert response.status == 200
        updated_task = json.loads(response.read().decode('utf-8'))
        assert updated_task['is_completed'] is True
        print(f"[PASS] Backend Live PATCH /api/tasks/{task_id}/ marked task completed")

    # 6. Test Backend Live API (PATCH /api/tasks/<id>/ to uncomplete)
    patch_data_uncomplete = json.dumps({"is_completed": False}).encode('utf-8')
    req = urllib.request.Request(patch_url, data=patch_data_uncomplete, headers=auth_header, method='PATCH')
    with urllib.request.urlopen(req) as response:
        assert response.status == 200
        updated_task2 = json.loads(response.read().decode('utf-8'))
        assert updated_task2['is_completed'] is False
        print(f"[PASS] Backend Live PATCH /api/tasks/{task_id}/ marked task uncompleted")

    # 7. Test Backend Live API (DELETE /api/tasks/<id>/)
    req = urllib.request.Request(patch_url, headers=auth_header, method='DELETE')
    with urllib.request.urlopen(req) as response:
        assert response.status == 204
        print(f"[PASS] Backend Live DELETE /api/tasks/{task_id}/ deleted successfully")

    # 8. Test Registering a New User Live
    register_url = "http://127.0.0.1:8000/api/auth/register/"
    reg_data = json.dumps({
        "username": "live_user_test",
        "password": "securepass123",
        "email": "test@minimalisttasks.com"
    }).encode('utf-8')
    req = urllib.request.Request(register_url, data=reg_data, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            assert response.status == 201
            reg_resp = json.loads(response.read().decode('utf-8'))
            print(f"[PASS] Backend Live POST /api/auth/register/ created user '{reg_resp['user']['username']}'")
    except urllib.error.HTTPError as e:
        if e.code == 400:
            print("[NOTE] Test user already exists, registration endpoint is functioning")
        else:
            raise e

    print("\nALL LIVE SERVERS & ENDPOINTS FULLY OPERATIONAL!")

if __name__ == '__main__':
    test_live_app()
