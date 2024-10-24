import { ref, type Ref } from 'vue'

export const useImageCarousel= (properties: Ref<Property[]>) => {
  const currentImageIndexes = ref<{ [key: string]: number }>({})
  const imageLoadErrors = ref<{ [key: string]: boolean }>({})

  const initializeImageIndexes = () => {
    properties.value.forEach(property => {
        
      if (!(property._id in currentImageIndexes.value)) {
        currentImageIndexes.value[property._id] = 0
        imageLoadErrors.value[property._id] = false
      }
    })
  }

  const handleImageError = (propertyId: string) => {
    imageLoadErrors.value[propertyId] = true
  }

  const nextImage = (propertyId: string) => {
    const property = properties.value.find(p => p._id === propertyId)
    if (property) {
      const totalImages = property.images.length
      currentImageIndexes.value[propertyId] = (currentImageIndexes.value[propertyId] + 1) % totalImages
    }
  }

  const prevImage = (propertyId: string) => {
    const property = properties.value.find(p => p._id === propertyId)
    if (property) {
      const totalImages = property.images.length
      currentImageIndexes.value[propertyId] = (currentImageIndexes.value[propertyId] - 1 + totalImages) % totalImages
    }
  }

  return {
    currentImageIndexes,
    imageLoadErrors,
    initializeImageIndexes,
    handleImageError,
    nextImage,
    prevImage
  }
}