from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'is_completed', 'owner', 'created_at')
    list_filter = ('is_completed', 'created_at', 'owner')
    search_fields = ('title', 'owner__username')
    ordering = ('-created_at',)
