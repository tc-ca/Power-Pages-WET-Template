// $(function () {
//     initLanguage();
//     initToolTips();
//     toggleOther();

//     $('#facility-list').change(function () {
//         toggleOther();
//     });

//     $('.mod-cancel').click(function () {
//         $('#ncModal').modal('hide');
//         window.location.reload();
//     });

//     $('input[data-allowed-name-chars-only]').on('input', handleOnInput);

//     // Form validation related stuff
//     wb.doc.on("wb-ready.wb-frmvld", function (event) {
//         setValidatorSettings();
//         initCustomValidation();
//         initAutoValidation();
//     });
// });

function initLanguage() {
  // Ensure language preference is added to all requests internal to this site
  // Also ensure base url is applied to all api lookup calls
  let oldXHROpen = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function (
    method,
    url,
    async,
    user,
    password
  ) {
    if (!url.includes("//") && !url.includes("lang=")) {
      if (url.includes("?")) {
        url += "&lang=" + _lang;
      } else {
        url += "?lang=" + _lang;
      }
    }

    if (!url.includes("//") && !url.includes(_baseUrl)) {
      if (!url.startsWith("/")) {
        url = "/" + url;
      }
      url = _baseUrl + url;
    }
    return oldXHROpen.apply(this, arguments);
  };
}

function setValidatorSettings() {
  // To avoid unwanted auto validation when out of focus
  const form1 = $(".section-form")[0];
  var val = $.data(form1, "validator");

  if (val) {
    var settings = $.data(form1, "validator").settings;
    settings.focusInvalid = false;
    settings.onfocusout = false;
    settings.onkeyup = false;
    settings.onclick = false;
  }
}

function initCustomValidation() {
  jQuery.validator.addMethod("not-only-white-space", function (value, element) {
    // Use regular expression to make sure the UCI value matches one of the two pattern 0000-0000 or 00-0000-0000
    return (
      this.optional(element) || /([a-zA-Z0-9àâçéèêëîïôûùüÿñæœ])/.test(value)
    );
  });
}

function initAutoValidation() {
  // Auto validate when navigating from the summary section error panel
  var searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("validate")) {
    if (searchParams.get("validate") == "true") {
      setTimeout(function () {
        // Wait for main thread to complete current actions (including initialization of WET validator) before running this
        $(".section-form").valid();
      }, 0);
    }
  }
}

function initToolTips() {
  $('[data-toggle="popover"]').popover({
    placement: "right",
    toggle: "popover",
    container: "body",
    template:
      '<div class="popover popover-medium"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
  });
}

function updateProvDDL() {
  $.ajax({
    type: "get",
    url:
      "/api/getProvState?countryId=" +
      $("#ddlCountry").val() +
      "&lang=" +
      _lang,
    datatype: "json",
    traditional: true,
    success: function (data) {
      var newdata = JSON.parse(data);
      var regions = $("#ddlProvince");
      regions.empty();
      $.each(newdata, function (i, region) {
        $("#ddlProvince").append(
          $("<option></option>").val(region.value).html(region.text)
        );
      });
    },
  });
}

function updateProvDDLbyID(countyryId, provinceId) {
  $.ajax({
    type: "get",
    url:
      "/api/getProvState?countryId=" + $(countyryId).val() + "&lang=" + _lang,
    datatype: "json",
    traditional: true,
    success: function (data) {
      var newdata = JSON.parse(data);
      var regions = $(provinceId);
      regions.empty();
      $.each(newdata, function (i, region) {
        $(provinceId).append(
          $("<option></option>").val(region.value).html(region.text)
        );
      });
    },
  });
}

function highlightActiveNavItem(itemTitle) {
  var list = $("#sidenav ul li button");
  $.each(list, function () {
    $(this).css("background-color", "");
  });
  for (var i = 0; i < list.length; i++) {
    var title = list[i].textContent;
    if (title == itemTitle) {
      list[i].style.backgroundColor = "lightblue";
    }
  }
}

function setSectionState() {
  var list = $(".section-state");
  var menu = $("#sidenav ul li button");
  var displayStatus = 0;

  for (var i = 0; i < list.length; i++) {
    var title = list[i].name;
    var state = list[i].value;

    for (var j = 0; j < menu.length; j++) {
      var menuName = menu[j].value;
      if (menuName == title) {
        var item = $('button[value="' + title + '"]');
        if (menuName != "SummarySubmission") {
          if (state == "Complete") {
            item.html('<i class="fa fa-check"></i>' + menu[j].innerText);
            displayStatus += 1;
          }
          if (state == "Invalid") {
            item.html(
              '<i class="fa fa-exclamation-triangle"></i>' + menu[j].innerText
            );
            displayStatus += 1;
          }
          if (state == "Clean") {
            item.html(menu[j].innerText);
          }
        }
      }
    }
  }

  if (displayStatus == 12) {
    $("#btnSummary").prop("disabled", false);
  } else {
    $("#btnSummary").prop("disabled", true);
  }
}

function resetValidation() {
  //Removes validation from input-fields
  $(".input-validation-error").addClass("input-validation-valid");
  $(".input-validation-error").removeClass("input-validation-error");
  //Removes validation message after input-fields
  $(".field-validation-error").addClass("field-validation-valid");
  $(".field-validation-error").removeClass("field-validation-error");
  //Removes validation summary
  $(".validation-summary-errors").addClass("validation-summary-valid");
  $(".validation-summary-errors").removeClass("validation-summary-errors");
}

function toggleOther() {
  $("#req-other").hide();
  var val = $("#facility-list").val();
  if (val === "0") {
    $("#req-other").show();
  } else {
    $("#req-other").hide();
  }
}

function toggleAddressSection() {
  const addressSection = '[data-name="sectPartnerAddress"]';
  $(addressSection).closest("fieldset").hide();
  //   USA and Canada fields is same for Marital Status
  //   domestic section has two parts
  const domesticAdress = "#tss_findaddress";
  const domesticProvince = "#tss_province";
  const foreignSection = "#tss_foreignprovince";
  $(domesticAdress).closest("tr").hide();
  $(domesticProvince).closest("td").hide();
  $(foreignSection).closest("tr").hide();
  var country = $("#tss_spousecountryofresidence").val();
  if (country !== "" && country !== "0") {
    $(addressSection).closest("fieldset").show();
    // TODO: to change Canada to 1013 and USA to 1079
    if (
      country === "110da1ef-6f03-ed11-82e6-002248d51a98" ||
      country === "52b20104-7003-ed11-82e6-002248d51a98"
    ) {
      $(domesticAdress).closest("tr").show();
      $(domesticProvince).closest("td").show();
      $(foreignSection).closest("tr").hide();
    } else {
      $(domesticAdress).closest("tr").hide();
      $(domesticProvince).closest("td").hide();
      $(foreignSection).closest("tr").show();
    }
  }
}

function toggleEyeColour(checkedValue) {
  $("#diff-colour").hide();

  if (checkedValue === true) {
    $("#right-eye").val("0");
  }
  if (checkedValue === false) {
    $("#diff-colour").show();
  }
}

function showInPopup(url, title) {
  var tst = url;
  $.ajax({
    type: "GET",
    url: url,
    success: function (res) {
      $("#form-modal .modal-body").html(res);
      $("#form-modal .modal-title").html(title);
      $("#form-modal").modal("show");
      $(".first-input").focus();
      toggleLegalSection();
    },
  });
}

function tooltipsEscape(event) {
  var tooltipsKeyValue = event.keyCode;
  if (tooltipsKeyValue == 27) {
    //if 'Enter' ESC
    $(".popoverTooltips").blur();
  }
}

function cleanUpName(name) {
  var text = name || "";

  // remove numbers and special characters
  var regex = /[0-9"!/<>?$%&*()+=:;_\\,~`@#^|“”‘’]/g;
  var text = text.replace(regex, "");

  // replace multiple spaces with one space
  regex = /\s{2,}/g;
  text = text.replace(regex, " ");

  return text;
}

function handleOnInput(evt) {
  var textBox = evt.target;
  var cursorPosition = textBox.selectionStart || 0;

  var text = textBox.value || "";
  var cleanedUp = cleanUpName(text);

  if (text !== cleanedUp) {
    textBox.value = cleanedUp;
    cursorPosition = cursorPosition > 0 ? cursorPosition - 1 : cursorPosition;
    textBox.setSelectionRange &&
      textBox.setSelectionRange(cursorPosition, cursorPosition);
  }
}

function addTooltip(labelName, tooltip) {
  var label = document.getElementById(labelName);
  $(
    '<a class="popoverTooltips" onkeydown="tooltipsEscape(event)" tabindex="0" data-trigger="focus" data-toggle="popover" data-content="' +
    tooltip +
    '" data-original-title="" title=""><i class="fa fa-info-circle ml-2"></i></a>'
  ).insertAfter(label);
}


/* Start Custom JS for Power Apps Portal*/
function AddPreviousButton(previousPageUrl) {
  //add previous button
  $("div.form-action-container-left").append("<input type='submit' id='btnPrevious' name='btnPrevious' value='Previous' class='btn btn-default button submit-btn' />");
  $("#btnPrevious").bind("click", function (e) {
    removeRequiredValidators();
    $('#liquid_form').validate();
    if ($('#liquid_form').valid()) {
      $('#liquid_form').attr('action', $('#liquid_form').attr('action') + '&redirect=' + previousPageUrl);

      WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions($("#UpdateButton").attr("name"), '', true, '', '', false, true));
    }
  });
}
function addRequiredValidator(fieldName, controlType) {
  var engRequiredText = '&nbsp;<strong class="required">(required)</strong>';
  var fraRequiredText = '&nbsp;<strong class="required">(obligatoire)</strong>';
  var requiredText = $('html').attr('data-lang') == "en" ? engRequiredText : fraRequiredText;
  switch (controlType) {
    case "radio":
      var fieldLabel = $('#' + fieldName + '_label').html();
      $('#' + fieldName + '_0').attr('required', 'required');
      var controlHtml = $('#' + fieldName).html();
      $('#' + fieldName + '_label').parent().remove();
      $('#' + fieldName).html('<fieldset class="chkbxrdio-grp"><legend class="required"><span class="field-name">' + fieldLabel + '</span>'+requiredText+'</legend>' + controlHtml + '</fieldset>')
      break;
    case "date":
      $('#' + fieldName + '_label').addClass('required');
      $('#' + fieldName + '_label').html("<span class='field-name'>" + $('#' + fieldName + '_label').html() + "</span>"+requiredText);
      $('#' + fieldName + '_datepicker_description').attr('required', 'required');
      break;
    default:
      $('#' + fieldName + '_label').addClass('required');
      $('#' + fieldName + '_label').html("<span class='field-name'>" + $('#' + fieldName + '_label').html() + "</span>"+requiredText);
      $('#' + fieldName).attr('required', 'required');
  }
}

function addRequiredValidatorForSubgrid(fieldName, engErrorMsg, fraErrorMsg) {
  //Add required style to the title
  $('#' + fieldName).closest('fieldset').children('legend:first').addClass('required');
  //Add a hidden text box under the title for validation purpose
  $('#' + fieldName).closest('fieldset').children('legend:first').after('<label for="tbl' + fieldName + '" id="lbl' + fieldName + '"></label><input type="text" id="tbl' + fieldName + '" has-value="true" class="form-control wb-inv ea-triggers-bound">')
  //Add validation method
  wb.doc.on("wb-ready.wb", function (event) {
    $.validator.addMethod("has-value", function (value, element) {
      return $('#' + fieldName + ' table tbody > tr').length > 0;
    }, $('html').attr('data-lang') == "en" ? engErrorMsg : fraErrorMsg)
  });
}

function addRequiredValidatorForSubgridInTable(fieldName, engErrorMsg, fraErrorMsg) {
  //Add required style to the title
  $('#' + fieldName).closest('tr').find('label:eq(0)').addClass('required');
  //Add a hidden text box under the title for validation purpose
  $('#' + fieldName).closest('tr').find('label:eq(0)').after('<label for="tbl' + fieldName + '" id="lbl' + fieldName + '"></label><input type="text" id="tbl' + fieldName + '" has-value="true" class="form-control wb-inv ea-triggers-bound">')
  //Add validation method
  wb.doc.on("wb-ready.wb", function (event) {
    $.validator.addMethod("has-value", function (value, element) {
      return $('#' + fieldName + ' table tbody > tr').length > 0;
    }, $('html').attr('data-lang') == "en" ? engErrorMsg : fraErrorMsg)
  });
}

function addPhoneValidator(fieldName) {
  $('#' + fieldName + '_label').html("<span class='field-name'>" + $('#' + fieldName + '_label').html() + "</span>");
  $('#' + fieldName).attr('type', 'tel');
  $('#' + fieldName).attr('data-rule-phoneus', 'true');
}

function addRangeValidator(fieldName, min, max) {
  $('#' + fieldName).attr('min', min);
  $('#' + fieldName).attr('max', max);
}

function removeRequiredValidators() {
  $("[required=required]").removeAttr("required");
  $("[has-value=true]").removeAttr("has-value");
}

function translateText(text) {
  if (text.includes("::"))
    return text.split("::")[$('html').attr('data-lang') == "en" ? 0 : 1];
  else
    return text;
}

function translateDropdown(fieldName) {
  //Translate all options
  $('#' + fieldName + ' option').text(function () { return translateText($(this).text()); });
}

function translateTableHeader(fieldName) {
  $('#' + fieldName).find('table thead tr th a').each(function () {
    var headerText = translateText($(this).contents().filter(function () { return this.nodeType !== 1; }).text());
    $(this).contents().filter(function () { return this.nodeType !== 1; }).remove();
    $(this).attr('aria-label', headerText);
    $(this).prepend($(this).attr('aria-label'));
  });
}

function sortDropdown(fieldName) {
  var options = $('#' + fieldName + ' option');
  var arr = options.map(function (_, o) { return { t: $(o).text(), v: o.value }; }).get();
  arr.sort(function (o1, o2) { return o1.t.localeCompare(o2.t); });
  options.each(function (i, o) {
    o.value = arr[i].v;
    $(o).text(arr[i].t);
  });
}

//Move Canada and US to the top
function sortCountryDropdown(fieldName, skipCanada, skipUS) {
  //change country list order
  if ($('#' + fieldName + ' option[disabled="disabled"]').length === 0) {
    sortDropdown(fieldName);
    $('<option disabled="disabled" value="">---------</option>').insertBefore('#' + fieldName + ' option:eq(1)');
    $('#' + fieldName + ' option[value="52b20104-7003-ed11-82e6-002248d51a98"]').insertBefore('#' + fieldName + ' option:eq(1)');
    $('#' + fieldName + ' option[value="110da1ef-6f03-ed11-82e6-002248d51a98"]').insertBefore('#' + fieldName + ' option:eq(1)');
  }
  if (skipUS === true) {
    $('#' + fieldName + ' option[value="52b20104-7003-ed11-82e6-002248d51a98"]').hide();
  }
  else {
    $('#' + fieldName + ' option[value="52b20104-7003-ed11-82e6-002248d51a98"]').show();

  }
  if (skipCanada === true) {
    $('#' + fieldName + ' option[value="110da1ef-6f03-ed11-82e6-002248d51a98"]').hide();
  }
  else {
    $('#' + fieldName + ' option[value="110da1ef-6f03-ed11-82e6-002248d51a98"]').show();
  }
}

function bindCountryChangeEvent(countryFieldName, provinceFieldName) {
  var lang = $('html').attr('data-lang');
  var ddlCountry = $("#" + countryFieldName);
  var ddlProvince = $("#" + provinceFieldName);

  ddlCountry.change(function () {
    // get id of selected primary field
    // this will work only if you render primary field as dropdown
    let primaryValue = $(this).find("option:selected").val();
    let selectedProvinceValue = ddlProvince.find("option:selected").val();
    // remove all option from dependent field
    ddlProvince.empty();
    ddlProvince.closest('tr').hide();
    if (primaryValue === "52b20104-7003-ed11-82e6-002248d51a98" || primaryValue === "110da1ef-6f03-ed11-82e6-002248d51a98") {
      // request to our custom page with id as parameter
      ddlProvince.closest('tr').show();
      $.getJSON("/_api/tss_provinces?$select=tss_provinceid,tss_englishname,tss_frenchname&$filter=_tss_country_value%20eq%20" + primaryValue + "&$orderby=" + (lang == "en" ? "tss_englishname" : "tss_frenchname"), function (data) {
        if (data.value.length > 0) {
          ddlProvince.append('<option value="" label=" " aria-label="Blank"> </option>');
          //create option for each returned entity
          data.value.forEach(element => {
            let option = document.createElement("option");
            option.value = element.tss_provinceid;
            option.innerText = (lang == "en" ? element.tss_englishname : element.tss_frenchname);

            ddlProvince.append(option);
          });
          ddlProvince.val(selectedProvinceValue);
        }
      });
    }

  });

}

function fixDatePickers() {
  $('*[id*=_datepicker_description]').on('change', function () {
    var datecontrol = $(this).closest('div').prev().val($(this).val() + 'T00:00:00.0000000');
  });
  $('*[for*=_datepicker_description]').contents().wrap("<span class='field-name'></span>");
  $('*[id*=_datepicker_description]').attr('type', 'date');
  $('*[id*=_datepicker_description]').attr('name', function () { return $(this).attr("id") });
  $('*[id*=_datepicker_description]').next().css('display', 'none');
}

function addWETValidatorToForm(formName) {
  $('#' + formName).wrap("<div class='wb-frmvld'></div>");
}

function addWETValidatorToModalForm(formName) {
  var script1 = document.createElement("script");  // create a script DOM node
  script1.src = "https://www.canada.ca/etc/designs/canada/cdts/gcweb/v4_0_43/wet-boew/js/jquery/2.2.4/jquery.min.js";  // set its src to the provided URL
  document.body.appendChild(script1);

  var script2 = document.createElement("script");  // create a script DOM node
  script2.src = "https://www.canada.ca/etc/designs/canada/cdts/gcweb/v4_0_43/wet-boew/js/wet-boew.min.js";  // set its src to the provided URL
  document.body.appendChild(script2);

  addWETValidatorToForm(formName);
}

/* End Custom JS for Power Apps Portal*/
