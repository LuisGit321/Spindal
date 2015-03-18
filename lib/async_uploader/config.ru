require 'rubygems'
require 'sinatra'
require 'sinatra/synchrony'
require 'fog'

# Make Foreman to show Thin log in console
$stdout.sync = true

['async_uploader', 'models/file_upload', 'lib/aws_uploader'].each do |f|
  require File.expand_path("../#{f}", __FILE__)
end

run AsyncUploader
