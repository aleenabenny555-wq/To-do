from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, RegisterView, CurrentUserView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),
]
