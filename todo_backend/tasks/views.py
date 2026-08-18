from rest_framework import viewsets, permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task
from .serializers import TaskSerializer, RegisterSerializer, UserSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tasks.
    Enforces strict user scoping: users only see and modify their own tasks.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return tasks belonging to the authenticated user
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the task owner
        serializer.save(owner=self.request.user)


class RegisterView(generics.CreateAPIView):
    """
    Public endpoint for registering a new user.
    Generates JWT access and refresh tokens immediately upon registration.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens for instant login
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": UserSerializer(user).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            "message": "User registered successfully."
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    """
    Endpoint to retrieve details of the currently authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
