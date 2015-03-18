require 'cgi'

class Paypal
	@@profile = PayPalSDKProfiles::Profile

  @@USER = App.paypal[:login]
  @@PWD = App.paypal[:password]
  @@SIGNATURE  = App.paypal[:signature]

  def initiate_checkout(recording, cancelUrl, returnUrl)
    @caller =  PayPalSDKCallers::Caller.new(false) 

    req = {  
    	:method                    => 'SetExpressCheckout',
      :paymentaction      =>  "Sale",
      :currencycode              => recording.band.paypal_currency,
      :cancelurl                 => cancelUrl,
	    :returnurl                 => returnUrl,
      :SOLUTIONTYPE    =>    "Sole",
      :PAYMENTREQUEST_0_AMT  => recording.price,
      :PAYMENTREQUEST_0_PAYMENTACTION => "Sale",
      :PAYMENTREQUEST_0_CURRENCYCODE => recording.band.paypal_currency,
      # PAYMENTREQUEST_0_TAXAMT
      :L_PAYMENTREQUEST_0_NAME0 => recording.title,
      :L_PAYMENTREQUEST_0_AMT0 => recording.price,
      :L_PAYMENTREQUEST_0_QTY0 => 1,
      :L_PAYMENTREQUEST_0_ITEMCATEGORY0 => "Digital",
      :REQCONFIRMSHIPPING => 0,
      :NOSHIPPING => 1,
      :USER  =>  @@USER,
      :PWD   => @@PWD,
      :SIGNATURE => @@SIGNATURE,
      :SUBJECT => recording.band.paypal_email
    }

    @set_ec_call = @caller.call(req)

    if @set_ec_call.success? 
      @transaction = recording.purchases.create({
        status: Purchase::STATES[:tokenized],
        token: @set_ec_call.response["TOKEN"].first.to_s,
        correlation_id: @set_ec_call.response["CORRELATIONID"].first.to_s,
        currency: recording.band.paypal_currency,
        amount: recording.price.to_s
        })
    end

    @set_ec_call
	end

  def complete_checkout(transaction)
    @caller =  PayPalSDKCallers::Caller.new(false)

    @do_ec_response = @caller.call(
      {
        :method        => 'DOExpressCheckoutPayment',
        :token         => transaction.token,
        :payerid       => transaction.payer_id,
        :amt           => transaction.amount,
        :currencycode  => transaction.currency,
        :PaymentAction => "Sale",
        :PAYMENTREQUEST_0_PAYMENTACTION => "Sale",
        :PAYMENTREQUEST_0_CURRENCYCODE => transaction.currency,
        :PAYMENTREQUEST_0_AMT => transaction.amount,
        :L_PAYMENTREQUEST_0_NAME0 => transaction.buyable.title,
        :L_PAYMENTREQUEST_0_AMT0 => transaction.amount,
        :L_PAYMENTREQUEST_0_QTY0 => 1,
        :L_PAYMENTREQUEST_0_ITEMCATEGORY0 => "Digital",
        :USER  =>  @@USER,
        :PWD   => @@PWD,
        :SIGNATURE => @@SIGNATURE,
        :SUBJECT => transaction.buyable.band.paypal_email 
      }
    )

    if @do_ec_response.success?
      if@do_ec_response.response["ACK"].first == "Success"
        transaction.update_attributes(
          status: Purchase::STATES[:paid],

          ack: @do_ec_response.response["ACK"].first,
          paymentinfo_0_transactionID: @do_ec_response.response["PAYMENTINFO_0_TRANSACTIONID"].first,
          paymentinfo_0_paymenttype: @do_ec_response.response["PAYMENTINFO_0_PAYMENTTYPE"].first,
          paymentinfo_0_ordertime: @do_ec_response.response["PAYMENTINFO_0_ORDERTIME"].first,
          paymentinfo_0_amt: @do_ec_response.response["PAYMENTINFO_0_AMT"].first,
          paymentinfo_0_feeamt: @do_ec_response.response["PAYMENTINFO_0_FEEAMT"].first,
          paymentinfo_0_taxamt: @do_ec_response.response["PAYMENTINFO_0_TAXAMT"].first,
          paymentinfo_0_paymentstatus: @do_ec_response.response["PAYMENTINFO_0_PAYMENTSTATUS"].first,
          paymentinfo_0_pendingreason: @do_ec_response.response["PAYMENTINFO_0_PENDINGREASON"].first,
          paymentinfo_0_reasoncode: @do_ec_response.response["PAYMENTINFO_0_REASONCODE"].first,
          paymentinfo_0_securemerchantaccountid: @do_ec_response.response["PAYMENTINFO_0_SECUREMERCHANTACCOUNTID"].first,
          paymentinfo_0_errorcode: @do_ec_response.response["PAYMENTINFO_0_ERRORCODE"].first,
          paymentinfo_0_ack: @do_ec_response.response["PAYMENTINFO_0_ACK"].first
          #Individual fields for each item follow, to be stored??
          )
      else
        transaction.update_attributes(
          ack: @do_ec_response.response["ACK"].first,
          status: Purchase::STATES[:error],
          l_errorcode_0: @do_ec_response.response["L_ERRORCODE0"].first,
          l_shortmessage_0: @do_ec_response.response["L_SHORTMESSAGE0"].first,
          l_longmessage_0: @do_ec_response.response["L_LONGMESSAGE0"].first,
          l_severitycode_0: @do_ec_response.response["L_SEVERITYCODE0"].first
        )
      end

    else 
      #What to do if !@do_ec_response.success?
    end

    @do_ec_response
  end

end