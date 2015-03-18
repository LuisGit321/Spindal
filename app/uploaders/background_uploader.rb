class BackgroundUploader < ImageUploader

	process :resize_to_fit => [1024, 768]
  process :change_res => '72'

  version :thumb do
    process :resize_to_fill => [167,167]
  end

  def change_res(dpi)
    manipulate! do |img|
      img.density dpi
      img = yield(img) if block_given?
      img
    end
  end

  def store_dir
    "uploads/bands/#{model.id.to_s.parameterize}/background/"
  end

end