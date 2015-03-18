desc "Compile stylus files"
task :stylus do
  compiled_css = Stylus.compile File.new('public/c/style.styl'), compress: true
  File.open('public/c/style.css', 'w+') do |file|
    file.puts compiled_css
  end
end