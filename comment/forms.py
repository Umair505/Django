from django import forms
from comment.models import Comment

class AddCommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        exclude = ['car', 'created_on']