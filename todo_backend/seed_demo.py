import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'todo_backend.settings')
django.setup()

from django.contrib.auth.models import User
from tasks.models import Task

def seed():
    # Create or update demo user
    demo_user, created = User.objects.get_or_create(
        username='demo',
        defaults={'email': 'demo@example.com'}
    )
    demo_user.set_password('password123')
    demo_user.save()
    
    # Create or update admin user
    admin_user, _ = User.objects.get_or_create(
        username='admin',
        defaults={'email': 'admin@example.com', 'is_staff': True, 'is_superuser': True}
    )
    admin_user.set_password('admin123')
    admin_user.save()

    # Create demo tasks if none exist
    if not Task.objects.filter(owner=demo_user).exists():
        Task.objects.create(
            title="Complete project report",
            is_completed=False,
            owner=demo_user
        )
        Task.objects.create(
            title="Study React & Django REST Framework",
            is_completed=False,
            owner=demo_user
        )
        Task.objects.create(
            title="Submit assignment",
            is_completed=False,
            owner=demo_user
        )
        Task.objects.create(
            title="Finish Python assignment",
            is_completed=True,
            owner=demo_user
        )
        Task.objects.create(
            title="Attend project meeting",
            is_completed=True,
            owner=demo_user
        )
        print("Demo tasks created for user 'demo'.")
    else:
        print("Tasks already exist for demo user.")

    print("Seeding completed. Users: demo / password123, admin / admin123")

if __name__ == '__main__':
    seed()
