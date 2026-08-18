from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    """
    Task model representing a daily to-do item owned by a specific user.
    """
    title = models.CharField(max_length=255)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        status = "Completed" if self.is_completed else "Pending"
        return f"{self.title} [{status}] (User: {self.owner.username})"
