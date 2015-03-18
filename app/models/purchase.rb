class Purchase
  include Mongoid::Document
  include Mongoid::Timestamps

  STATES = {
    tokenized: "tokenized",
    authorized: "authorized",
    declined: "declined",
    paid: "paid"
  }

  belongs_to :buyable, :polymorphic => true
  validates :buyable, :presence => true

  # [tokenized, authorized, declined, paid]
  field :status, type: String

  # SetExpressCheckout Fields
  field :token
  field :payer_id
  field :correlation_id
  field :currency
  field :amount, type: Float
  
  field :ack
  field :paymentinfo_0_transactionID
  field :paymentinfo_0_paymenttype
  field :paymentinfo_0_ordertime
  field :paymentinfo_0_amt, type: Float
  field :paymentinfo_0_feeamt, type: Float
  field :paymentinfo_0_taxamt, type: Float
  field :paymentinfo_0_paymentstatus
  field :paymentinfo_0_pendingreason
  field :paymentinfo_0_reasoncode
  field :paymentinfo_0_securemerchantaccountid
  field :paymentinfo_0_errorcode
  field :paymentinfo_0_ack

  field :l_errorcode_0
  field :l_shortmessage_0
  field :l_longmessage_0
  field :l_severitycode_0

end
