import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.test import APIClient
from tasks.models import Task


def run_tests():
    print("--- Starting Backend API Test Suite ---")
    client = APIClient()

    # 1. Test Login with demo user
    response = client.post('/api/auth/token/', {
        'username': 'demo',
        'password': 'password123'
    }, format='json')
    assert response.status_code == 200, f"Login failed: {response.data}"
    access_token = response.data['access']
    refresh_token = response.data['refresh']
    print("[PASS] JWT Token Generation successful")

    # 2. Test Token Refresh
    response = client.post('/api/auth/token/refresh/', {
        'refresh': refresh_token
    }, format='json')
    assert response.status_code == 200, f"Token refresh failed: {response.data}"
    new_access_token = response.data['access']
    print("[PASS] JWT Token Refresh successful")

    # Set Authorization header
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + new_access_token)

    # 3. Test Get Current User
    response = client.get('/api/auth/me/')
    assert response.status_code == 200 and response.data['username'] == 'demo'
    print("[PASS] GET /api/auth/me/ returned correct user")

    # 4. Test List Tasks (GET /api/tasks/)
    response = client.get('/api/tasks/')
    assert response.status_code == 200
    assert isinstance(response.data, list)
    initial_count = len(response.data)
    print(f"[PASS] GET /api/tasks/ retrieved {initial_count} tasks")

    # 5. Test Create Task (POST /api/tasks/)
    new_title = "Automated Test Task 1"
    response = client.post('/api/tasks/', {'title': new_title}, format='json')
    assert response.status_code == 201, f"Create task failed: {response.data}"
    created_task = response.data
    task_id = created_task['id']
    assert created_task['title'] == new_title
    assert created_task['is_completed'] is False
    assert created_task['owner']['username'] == 'demo'
    print(f"[PASS] POST /api/tasks/ created task #{task_id} with owner 'demo'")

    # 6. Test Update Task / Toggle complete (PATCH /api/tasks/<id>/)
    response = client.patch(f'/api/tasks/{task_id}/', {'is_completed': True}, format='json')
    assert response.status_code == 200
    assert response.data['is_completed'] is True
    print(f"[PASS] PATCH /api/tasks/{task_id}/ updated is_completed to True")

    # 7. Test User Isolation / Security Scoping
    # Create second user
    user2, _ = User.objects.get_or_create(username='testuser2', defaults={'email': 'test2@example.com'})
    user2.set_password('pass1234')
    user2.save()

    client2 = APIClient()
    resp2 = client2.post('/api/auth/token/', {'username': 'testuser2', 'password': 'pass1234'}, format='json')
    client2.credentials(HTTP_AUTHORIZATION='Bearer ' + resp2.data['access'])

    # user2 listing tasks should not see user1 tasks
    resp2_list = client2.get('/api/tasks/')
    user2_task_ids = [t['id'] for t in resp2_list.data]
    assert task_id not in user2_task_ids
    print("[PASS] User isolation verified: User 2 cannot see User 1's tasks in listing")

    # user2 trying to patch or delete user1's task should get 404
    resp2_patch = client2.patch(f'/api/tasks/{task_id}/', {'is_completed': False}, format='json')
    assert resp2_patch.status_code == 404
    print("[PASS] User isolation verified: User 2 receives 404 attempting to modify User 1's task")

    # 8. Test Delete Task (DELETE /api/tasks/<id>/)
    response = client.delete(f'/api/tasks/{task_id}/')
    assert response.status_code == 204
    print(f"[PASS] DELETE /api/tasks/{task_id}/ deleted successfully")

    # Verify deleted task no longer exists
    assert not Task.objects.filter(id=task_id).exists()
    print("[PASS] Verified task is completely removed from database")

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")


if __name__ == '__main__':
    run_tests()
