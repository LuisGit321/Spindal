class CreditCard
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :user
  
  field :type, type: String
  field :number, type: String
  field :expiry_month, type: Integer
  field :expiry_year, type: Integer
  field :security_code, type: Integer
  field :billing_zip_code, type: Integer
end
