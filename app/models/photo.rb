class Photo
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :imageable, :polymorphic => true
  validates :imageable, :presence => true

  field :file, type: String
  field :order, type: String

  mount_uploader :file, PhotoUploader
end