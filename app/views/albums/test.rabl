collection @albums

attributes :id, :title, :cover_image, :release_year

child(:songs) {
  attributes :id, :track_no, :title, :lyrics, :price, :amazon_store_link, :itunes_store_link
}