CarrierWave.configure do |config|
  config.storage         = :fog
  config.fog_credentials = {
    :provider               => 'AWS',
    :aws_access_key_id      => App.s3_access_key_id,
    :aws_secret_access_key  => App.s3_secret_access_key,
    :region                 => App.s3_region
  }
  config.fog_directory  = App.s3_bucket
  config.fog_public     = true
  config.fog_attributes = { 'Cache-Control' => 'max-age=315576000' }
end
