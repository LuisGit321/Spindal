class SongEncoding
  include Mongoid::Document
  include Mongoid::Timestamps

  embedded_in :song

  field :encoding_id
  field :streamable, type: Boolean
  # This model has several fields, based on the Zencoder API.
  # https://app.zencoder.com/docs/api/outputs/show

  scope :streamable, where(streamable: true)

  def zencoder_attributes=(zen_attrs)
    attrs = zen_attrs.dup
    e_id = attrs.delete('id')

    self.attributes = attrs
    self.encoding_id = e_id
    self.streamable = self.audio_bitrate_in_kbps < 192
  end
end
