$(document).ready(function(){
  
  $("select#categories option").each(function(){
    var collHandle = $(this).attr("value");
  	$(".gift-box-items-wrap").append("<div id='gift-box-items-"+collHandle+"'></div>");
    getCollectionProducts(collHandle);
  });
  
  
  $("a.progress_bar").click(function(e){
    e.preventDefault();
  	var divID = $(this).attr("data-href");
    if(divID == "#step-2"){
      $("button.complete_box").trigger("click");
    }else if(divID == "#step-3"){
      $("button.complete_box").trigger("click");
    }else{
      $(".stepwizard-step a").removeClass("active");
      $(this).addClass("active");

      $(".box-container > div").hide();
      $(".box-container > div"+divID).show();
    }
  });
  
  /*
  $("select#categories").change(function(){
    $(".gift-box-items-wrap > div").hide();
    $(".gift-box-items-wrap > div#gift-box-items-"+$(this).val()).show();
  });
  */
  
  function getCollectionProducts(collectionHandle){
    $.ajax({
      type: "GET",
      url: "/collections/"+collectionHandle+"?view=customized-gift-items",
      dataType: "html",
      success: function(data){
        $(".gift-box-items-wrap #gift-box-items-"+collectionHandle).html(data);
      }
    }); 
  }
  
  
  $(document).on("click", "a.add-to-box", function(){
    $(this).parents(".thumbnail").find(".qty_group button.plus_gift").trigger("click");
  });
  
  function updateItemToBox(itemData){
    var boxItem = $("#box-item-"+itemData.id);
    var boxLineItem = $("#box-line-item-"+itemData.id);
       
    if(boxItem.length){
      boxItem.find(".quantity-badge").text(itemData.qty);
      
      boxLineItem.attr("data-qty", itemData.qty);
      boxLineItem.find(".quantity").text(itemData.qty);
      boxLineItem.find(".base-price").text(Shopify.formatMoney(itemData.price * itemData.qty));
      $('.right-box-main').addClass('hide');
       
    }else{
      var newHTML = "";
      newHTML += '<div class="col-lg-3 col-md-4 col-sm-4 col-xs-6" id="box-item-'+itemData.id+'">'
        newHTML += '<div class="pic-box-main">';
          newHTML += '<img src="'+itemData.image+'">';
          newHTML += '<div class="quantity-badge" >'+itemData.qty+'</div>';
        newHTML += '</div>';
      newHTML += '</div>';

      $('.right-box-main').addClass('hide');
      $(".selected_gifts_preview").append(newHTML);
      
      var newLineItem  = "";
      newLineItem += '<div class="small-box-main" id="box-line-item-'+itemData.id+'" data-price="'+itemData.price+'" data-vid="'+itemData.vid+'" data-qty="'+itemData.qty+'" >';
        newLineItem += '<div class="quantity bellnumbers">'+itemData.qty+'</div>';
        newLineItem += '<div class="name prev_selectedbox_title">'+itemData.title+'</div>';
        newLineItem += '<div class="price"> <span class="base-price ng-binding prev_selectedbox_price addedgiftPrice" >'+Shopify.formatMoney(itemData.price * itemData.qty)+'</span> </div>';
        newLineItem += '<a data-proid="'+itemData.id+'" class="remove delete_gifts"> <img src="https://build.somethingsplendidco.com/assets/images/close-icon.png"> </a>'; 
      newLineItem += '</div>';
      
      $(".selected_gifts").append(newLineItem);
    }
    
    if(itemData.qty < 1){
      boxItem.remove();
      boxLineItem.remove();
    }
    
    updateSubTotal();
  }



  function updateSubTotal(){
    // var giftBoxPrice = parseInt($(".prev_selectedbox_pricefirst").attr("data-price"));
      var giftBoxPrice = parseInt($(0));
   // alert(giftBoxPrice);
    var giftBoxItemsPrice = 0;
    var total = 0;
    var singleproprice = 0;
    $(".selected_gifts > div").each(function(){
    	giftBoxItemsPrice += parseInt(parseInt($(this).attr("data-price")) * parseInt($(this).attr("data-qty")));
       singleproprice = parseInt($(this).attr("data-price"));
      var qtyvalue = parseInt($(this).attr("data-qty"));
      total +=qtyvalue;
    });

var totalprice = 0;
    
    
    if(giftBoxItemsPrice > 0){
      $('.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.col-lg-12.col-md-12.col-sm-12.col-xs-12').removeClass('hide');
      $('.btn.btn-primary.btn-lg.BoxAddtocart').removeClass('disabled');
if(total>2 && total <6){
  var pricefinaltotal = giftBoxItemsPrice - singleproprice;
  totalprice = Shopify.formatMoney(pricefinaltotal, '€{{amount}}');

  
   $('button.btn.btn-primary.btn-lg.BoxAddtocart').html('In den Warenkorb legen '+totalprice+'&nbsp <span class="textthrough">'+ Shopify.formatMoney(giftBoxItemsPrice, '€{{amount}}') +' <span> ');

 var savemoney = Shopify.formatMoney(pricefinaltotal/total, '€{{amount}}');

 var savepercent = Math.round(((giftBoxItemsPrice-pricefinaltotal)*100)/giftBoxItemsPrice);
  $('.discount-box').html('<div class="saving"><div class="savepercent">Du sparst '+savepercent+'% </div><div class="savemoney">Nur '+ savemoney +'<span> pro Flasche</span> </div>');


}
  else if(total >5 ){
  var pricefinaltotal = giftBoxItemsPrice - singleproprice*2;
  totalprice = Shopify.formatMoney(pricefinaltotal, '€{{amount}}');
   $('button.btn.btn-primary.btn-lg.BoxAddtocart').html('In den Warenkorb legen '+totalprice+'&nbsp <span class="textthrough"> '+ Shopify.formatMoney(giftBoxItemsPrice, '€{{amount}}') +' <span> ');
 var savemoney = Shopify.formatMoney(pricefinaltotal/total, '€{{amount}}');

 var savepercent = Math.round(((giftBoxItemsPrice-pricefinaltotal)*100)/giftBoxItemsPrice);
 $('.discount-box').html('<div class="saving"><div class="savepercent">Du sparst '+savepercent+'% </div><div class="savemoney">Nur '+ savemoney +'<span> pro Flasche</span> </div>');
  }
      else{
          totalprice = Shopify.formatMoney(giftBoxItemsPrice, '€{{amount}}');
         $('button.btn.btn-primary.btn-lg.BoxAddtocart').text('In den Warenkorb legen '+totalprice+'');
        $('.discount-box').html('');
      }
       
    
     


     
    }
    else{
           $('.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.col-lg-12.col-md-12.col-sm-12.col-xs-12').addClass('hide');
      $('.btn.btn-primary.btn-lg.BoxAddtocart').addClass('disabled');
      $('button.btn.btn-primary.btn-lg.BoxAddtocart').text('Wähle mindestens 1 Flasche!');
    }
    $(".box_total").html(Shopify.formatMoney(giftBoxItemsPrice, '€{{amount}}'));
  }
  
  $(document).on("click", ".button-main-box button", function(){
    var qtyObj = $(this).parents(".button-main-box").find("input.quantity_boxesGIFT");
    var oldQty = parseInt(qtyObj.val());
    var newQty = oldQty;
    if($(this).hasClass("minus_gift")){
      if(oldQty < 1){
        newQty = 0;
      }else{
        newQty = oldQty - 1;
      }
    }else{
      newQty = oldQty + 1;
    }
    
    $(this).parents(".button-main-box").find("input.quantity_boxesGIFT").val(newQty);
    
    var itemData = [];
    itemData['id'] = qtyObj.attr("data-producid");
    itemData['vid'] = qtyObj.attr("data-produvid");
    itemData['title'] = qtyObj.attr("data-title");
    itemData['price'] = qtyObj.attr("data-price");
    itemData['image'] = qtyObj.attr("data-img");
    itemData['qty'] = newQty;
    
    if(newQty < 1){
    //  $(this).parents(".thumbnail").find(".add-to-box-wrap").removeAttr("style");
      //$(this).parents(".thumbnail").find(".qty_group").hide(); 
      $(this).parents(".thumbnail").removeClass("thumbnail-added");
    }else{
      //$(this).parents(".thumbnail").find(".add-to-box-wrap").hide();
     // $(this).parents(".thumbnail").find(".qty_group").show(); 
      $(this).parents(".thumbnail").addClass("thumbnail-added");
    }
    
    updateItemToBox(itemData);
  });
  
  
  $(document).on("click", "a.delete_gifts", function(){
  	var productID = $(this).attr("data-proid");
    $("#qtyval_"+productID).val(0);
    $("#qtyval_"+productID).parents(".input-group1").find("button.minus_gift").trigger("click");
  });
  
  $("button.complete_box").click(function(e){
  	e.preventDefault();
    var giftObj = $(".selected_gifts");
    var giftItemsObj = $(".selected_gifts > div");
    var giftQty = 0;
    giftItemsObj.each(function(){ giftQty += parseInt($(this).attr("data-qty")); });
    if(giftQty < 1){
      $("#box-alert-trigger").trigger("click");
    }else{    
      $(".stepwizard-step a").removeClass("active");
      $(".stepwizard-step a.step2").addClass("active");

      $(".box-container > div").hide();
      $(".box-container > div#step-2").show();
    }
  });
  
  
  $("textarea.card_message").on("keyup keypress focusin focusout blur change", function(){
    var remainingCnt = 500 - $(this).val().length;
    if(remainingCnt >= 0){
      $(this).parents(".modul-text").find(".count_remaining").text(remainingCnt+" characters remaining");
      $(this).parents(".modul-text").find(".BoxAddtocart").removeAttr("disabled");
    }else{
      $(this).parents(".modul-text").find(".count_remaining").text("sorry! limit reached");
      $(this).parents(".modul-text").find(".BoxAddtocart").attr("disabled");
    }
  });
  
  
  $("button.BoxAddtocart").click(function(){
    //var giftCardID = $(this).attr("data-cardvid");
    //var giftCardMsg = $.trim($(this).parents(".modul-text").find("textarea.card_message").val());
  	var giftBoxID = $(".prev_selectedbox_pricefirst").attr("data-vid");
    //var giftData = "updates["+giftBoxID+"]=1";
    
    var giftData = "";
    var giftCardMsg = $.trim($(".card-msg-wrap textarea.card_message").val());
    
    $(".selected_gifts > div").each(function(){
    	giftData += "&updates["+$(this).attr('data-vid')+"]="+$(this).attr('data-qty');
    });
    
    $(this).attr("disabled");
    $(this).html("Bitte Warten");
    $.ajax({
      type: 'POST',
      url: '/cart/clear.js',
      complete: function(){
       // alert('Added');
        $.ajax({
          type: 'POST',
          url: '/cart/update.js',
          dataType: 'json',
          data:giftData,
          async:false,
          success: function(res){
            var cardData = {
                "id": giftBoxID,
                "quantity": 0,
                "properties": {"Message": giftCardMsg}
              }
            $.ajax({
              type: 'POST',
              url: '/cart/add.js',
              dataType: 'json',
              data:cardData,
              async:false,
              success: function(res){
                window.location.href = "/checkout";
              },
              error: function(res){
                alert("Ops, something went wrong!")
              }
            });
          },
          error: function(res){
            alert("Ops, something went wrong!")
          }
        });
      }
    });
      
    
  });
  
  
});



var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};