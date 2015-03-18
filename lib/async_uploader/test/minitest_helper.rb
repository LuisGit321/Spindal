ENV['RACK_ENV'] = 'test'

require 'minitest/autorun'
require 'minitest/pride'
require 'fog'

class IntegrationTest < MiniTest::Spec
  require 'sinatra'
  require 'sinatra/synchrony'
  require 'capybara'
  require 'capybara/dsl'

  ['async_uploader', 'models/file_upload'].each do |f|
    require File.expand_path f
  end

  include Capybara::DSL
  register_spec_type /integration$/, self

  Capybara.app = AsyncUploader
end
