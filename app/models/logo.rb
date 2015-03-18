class Logo
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :band
  validates :band, :presence => true
  #validate :validate_maximum_image_height
  field :band_logo_name
  field :font_name
  field :font_color
  field :font_size
  field :alignment
  field :file
  mount_uploader :file, LogoUploader
  
  # def validate_maximum_image_height
    # image = MiniMagick::Image.open(file.path)
    # if image[:height] > 400
      # logger.debug "HEIGHT===#{image[:height]}"
      # errors.add :image, "Logo should not be more than 400px of height!!!" 
      # logger.debug "ERRORs===#{errors}"
      # return false
    # end
    # return true
  # end
  
end
