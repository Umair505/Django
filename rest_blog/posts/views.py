from django.shortcuts import render
from rest_framework.views import APIView
from .models import Post
from . serializers import PostSerializer
from rest_framework.response import Response
from rest_framework import status
from . permissions import IsAuthorOrReadOnly
# Create your views here.
class PostList(APIView):
    permission_classes = [IsAuthorOrReadOnly]
    def get(self,request, format=None):
        print("inside get in post list")
        posts = Post.objects.all()
        serializer = PostSerializer(posts,many = True)
        return Response(serializer.data)
    def post(self,request, format=None):
        print("inside Post in post list")
        serializer = PostSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PostDetail(APIView):
    permission_classes = [IsAuthorOrReadOnly]
    def get_object(self,pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    def get(self,request,pk,format=None):
        post = self.get_object(pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)
    def put(self,request,pk,format=None):
        print("PUT")
        post = self.get_object(pk)
        serializer = PostSerializer(post,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,pk,format=None):
        print("Delete request")
        post = self.get_object(pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
       