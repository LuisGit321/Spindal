# encoding: utf-8
class LogoUploader < ImageUploader
  include CarrierWave::MiniMagick

  storage :fog
  
  process :resize_to_fit => [250, nil]
  #process :make_transparent => "#ffff"

  #to make the given color transparent in to the image
  def make_transparent(bgcolor)
    manipulate! do |img|
      img.format("png") do |c|
        c.transparent bgcolor
      end
      img
    end
  end
  
  def store_dir
    "uploads/bands/#{model.band.id.to_s.parameterize}/logos/"
  end
  
end