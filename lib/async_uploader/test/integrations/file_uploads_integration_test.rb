require 'minitest_helper'

describe 'File uploads integration' do
  before do
    visit '/'
  end

  it "Shows a success message when the file is uploaded" do
    attach_file 'File', File.join(File.expand_path('../../support/file.txt', __FILE__))
    click_on 'Upload'
    page.text.must_include "File successfully uploaded."
  end

  it "Shows an error message when no file is attached" do
    click_on 'Upload'
    page.text.must_include "File could not be uploaded."
  end
end
