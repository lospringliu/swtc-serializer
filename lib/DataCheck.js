/*
 * NODE JS SDK for Jingtum network； Wallet
 * Copyright (C) 2016 by Jingtum Inc.
 * or its affiliates. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Data functions used to check the valid data types.
 */
var CURRENCY_NAME_LEN = 3
var CURRENCY_NAME_LEN2 = 6
var TUM_NAME_LEN = 40
var Wallet = require("swtc-factory").Wallet

function allNumeric(text) {
  // assign a string with numbers (0-9) in the HTML form
  var numbers = /^[0-9]+$/
  // Check if the input contains all numbers.
  if (String(text).match(numbers)) {
    return true
  } else {
    return false
  }
}

/*
 * Decide if the input is a valid string
 * for a float value.
 */
function isFloat(val) {
  var floatRegex = /^-?\d+(?:[.,]\d*?)?$/
  if (!floatRegex.test(val) || Number.isNaN(parseFloat(val))) {
    return false
  }

  return true
}

// Detect if the string contains only
// numbers and capital letters.

function isLetterNumer(str) {
  var numbers = /^[0-9A-Z]+$/
  return !!String(str).match(numbers)
}

// return true if the code is 3 letters/numbers
function isCurrency(code) {
  return (
    typeof code === "string" &&
    (!!code &&
      code.length >= CURRENCY_NAME_LEN &&
      code.length <= CURRENCY_NAME_LEN2)
  )
}

// return true if the code is 40 letters/numbers
function isCustomTum(code) {
  return isLetterNumer(code) && String(code).length === TUM_NAME_LEN
}

/*
 * Return true is the input string
 * is a valid TUM code
 *
 */
function isTumCode(code) {
  // input must be defined and non-null
  // Make sure if the code meets the coding rule
  // tum: Custom tum, 40 capital letters or number
  return (
    typeof code === "string" &&
    (code === "SWT" || isCurrency(code) || isCustomTum(code))
  )
}

/*
 * Only valid for freeze and authorize
 */
function isRelation(str) {
  return typeof str === "string" && (str === "freeze" || str === "autorize")
}

/*
 * Check if the input is a valid Amount object
 * Amount should have 3 properties
 * value
 * issuer/counterparty
 * currency
 */
function isAmount(obj, token) {
  if (obj === null || typeof obj !== "object") {
    return false
  }
  if (typeof obj.value !== "string" || !isFloat(obj.value)) {
    return false
  }
  if (!isTumCode(obj.currency)) {
    return false
  }
  // AMOUNT could have a field named
  // either as 'issuer'
  // or as 'counterparty'
  // for SWT, this can be undefined
  if (typeof obj.issuer !== "undefined" && obj.issuer !== "") {
    if (!Wallet.isValidAddress(obj.issuer, token)) {
      return false
    }
  } else {
    // if currency === 'SWT',自动补全issuer.
    if (obj.currency === "SWT") {
      obj.issuer = ""
    } else {
      return false
    }
  }
  return true
}

/*
 * balances  余额
 * value  String  余额
 * currency  String  货币名称，三个字母或是40个字符的字符串
 * counterparty  String  货币发行方
 * freezed  String  冻结的金额
 */
function isBalance(obj, token) {
  if (obj === null || typeof obj !== "object") {
    return false
  }

  if (!isFloat(obj.freezed)) {
    return false
  }

  if (!isFloat(obj.value)) {
    return false
  }

  if (!isTumCode(obj.currency)) {
    return false
  }

  // AMOUNT could have a field named
  // either as 'issuer'
  // or as 'counterparty'

  if (!Wallet.isValidAddress(obj.counterparty, token)) {
    return false
  }
  return true
}

exports.isCustomTum = isCustomTum
exports.allNumeric = allNumeric
exports.isRelation = isRelation
exports.isTumCode = isTumCode
exports.isCurrency = isCurrency
exports.isAmount = isAmount
exports.isBalance = isBalance
exports.isLetterNumer = isLetterNumer
