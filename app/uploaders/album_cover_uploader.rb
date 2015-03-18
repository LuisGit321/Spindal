class AlbumCoverUploader < ImageUploader

	process :resize_to_fit => [600, 600]
  process :change_res => '72'

  version :display do
    process :resize_to_fill => [250, 250]
  end

  version :preview do
    process :resize_to_fill => [185, 185]
  end

  def change_res(dpi)
    manipulate! do |img|
      img.density dpi
      img = yield(img) if block_given?
      img
    end
  end

  def store_dir
    "uploads/bands/#{model.band.id.to_s.parameterize}/albums/#{model.id.to_s.parameterize}/cover/"
  end

end