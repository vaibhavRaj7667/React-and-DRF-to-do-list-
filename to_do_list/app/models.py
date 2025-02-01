from django.db import models
from django.contrib.auth.models import User

class task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    details = models.TextField()
    
    def __str__(self):
        return self.details