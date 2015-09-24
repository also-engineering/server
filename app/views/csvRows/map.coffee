###

This returns an array of objects that describe a CSV
The only real behavior worth mentioning here is 

###

(doc) ->

  return unless doc.collection is "result"

  clone = `function (item) { if (!item) { return item; } var types = [ Number, String, Boolean ], result; types.forEach(function(type) { if (item instanceof type) { result = type( item ); } }); if (typeof result == "undefined") { if (Object.prototype.toString.call( item ) === "[object Array]") { result = []; item.forEach(function(child, index, array) { result[index] = clone( child ); }); } else if (typeof item == "object") { if (item.nodeType && typeof item.cloneNode == "function") { var result = item.cloneNode( true ); } else if (!item.prototype) { if (item instanceof Date) { result = new Date(item); } else { result = {}; for (var i in item) { result[i] = clone( item[i] ); } } } else { if (false && item.constructor) { result = new item.constructor(); } else { result = item; } } } else { result = item; } } return result; }`

  utils = require("views/lib/utils")

  exportValue = utils.exportValue
  cell        = utils.cell

  prototypes  = require("views/lib/prototypes")

  pairsGrid        = prototypes.pairsGrid
  pairsSurvey      = prototypes.pairsSurvey
  pairsDatetime    = prototypes.pairsDatetime
  pairsObservation = prototypes.pairsObservation
  pairsGps         = prototypes.pairsGps
  pairsLocation    = prototypes.pairsLocation

  subtestData = doc.subtestData

  isClassResult = typeof doc.klassId isnt "undefined" 

  # turn class results into regular results
  if isClassResult

    newData               = clone(doc.subtestData)
    newData.subtestId     = doc.subtestId

    newData.time_allowed  = doc.timeAllowed

    subtestData = [ {
      data      : newData
      prototype : doc.prototype
      subtestId : doc.subtestId
    } ]

    log "klass Result: #{doc._id}"


  ###
  Fix doubles (temporary)
  ###

  doublesIncluded = clone(subtestData)

  subtestData = []
  subtestIds  = []

  for subtest in doublesIncluded
    #log subtest.subtestId + " " + subtestIds.indexOf(subtest.subtestId)
    if subtestIds.indexOf(subtest.subtestId) == -1
      subtestData.push(subtest)
      subtestIds.push(subtest.subtestId)

  result = []

  ###
  Handle universal fields first
  ###

  if isClassResult
    result.push cell "universal", "studentId", doc['studentId']
  else
    result.push cell "universal", "enumerator",   doc['enumerator']
    result.push cell "universal", "start_time", ( doc['starttime'] || doc['start_time'] )
    result.push cell "universal", "order_map",  (if doc['order_map']? then doc['order_map'].join(",") else "no_record")

  #
  # Subtest loop
  #
  datetimeCount = 0;
  linearOrder = subtestData.map (el, i) -> return i

  orderMap = if doc["order_map"]?
      doc["order_map"]
    else if doc["orderMap"]?
      doc["orderMap"]
    else
      linearOrder

  timestamps = []

  orderedSubtests = orderMap.map (index) ->
    tmp = subtestData[index]
    subtestData[index] = null
    return tmp

  orderedSubtests = orderedSubtests.concat(subtestData);
  subtests = []
  for subtest in orderedSubtests
    subtests.push(subtest) if subtest?

  orderedSubtests = subtests
  # go through each subtest in this result
  for subtest in orderedSubtests

    prototype = subtest['prototype']

    # simple prototypes
    if prototype == "id"
      result.push cell subtest, "id", subtest.data.participant_id
    else if prototype == "consent"
      result.push cell subtest, "consent", subtest.data.consent

    else if prototype == "complete"
      result = result.concat [
        cell subtest, "additional_comments", subtest.data.comment
        cell subtest, "end_time"           , subtest.data.end_time
      ]

    else if prototype == "datetime"
      datetimeSuffix = if datetimeCount > 0 then "_#{datetimeCount}" else ""
      result = result.concat( pairsDatetime( subtest, datetimeSuffix ) )
      datetimeCount++

    else if prototype == "location"
      result = result.concat pairsLocation subtest

    else if prototype == "grid"
      result = result.concat pairsGrid subtest, isClassResult

    else if prototype == "survey"
      result = result.concat pairsSurvey subtest

    else if prototype == "observation"
      result = result.concat pairsObservation subtest

    else if prototype == "gps"
      result = result.concat pairsGps subtest

    timestamps.push subtest.timestamp

  timestamps.sort()
  for timestamp, i in timestamps
    result.push cell("timestamp_" + i, "timestamp_" + i, timestamp)


  keyId =
    if isClassResult
      doc.klassId
    else
      doc._id

  emit keyId, result
