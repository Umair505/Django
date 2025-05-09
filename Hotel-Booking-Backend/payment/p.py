
# media 
class Review(models.Model):
    STAR_CHOICES = [
        ('⭐', '⭐'),
        ('⭐⭐', '⭐⭐'),
        ('⭐⭐⭐', '⭐⭐⭐'),
        ('⭐⭐⭐⭐', '⭐⭐⭐⭐'),
        ('⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'),
    ]
    hotel = models.ForeignKey(
        Hotel, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews',)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    body = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    rating = models.CharField(choices=STAR_CHOICES, max_length=10)

    class Meta:
        unique_together = ('hotel', 'user')
        
# serializer.py
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [ 'body',  'rating', 'hotel', 'user']
        
                
# views.py
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related('hotel', 'user').all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['hotel_id']

