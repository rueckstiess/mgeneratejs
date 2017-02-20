# mgeneratejs [![travis][travis_img]][travis_url] [![npm][npm_img]][npm_url]

_mgeneratejs_ generates structured, semi-random JSON data according to a
template object. It offers both a command line script and a Javascript API.

## Installation

```
npm install -g mgeneratejs
```

## Example

```
mgeneratejs '{"name": "$name", "age": "$age", "emails": {"$array": {"of": "$email", "number": 3}}}' -n 5
```
Results in:
```
{"name":"Glenn Simmons","age":32,"emails":["ivuge@afovopid.tt","gied@orsin.zw","wuhowbi@con.uk"]}
{"name":"Jane Santiago","age":57,"emails":["oliclon@ohaoni.la","hetoufi@em.ug","ecwawce@sewwato.kn"]}
{"name":"Winifred Martinez","age":59,"emails":["veag@gi.fm","liwfecor@vifbevof.gr","siwluz@habif.gf"]}
{"name":"Helena Chandler","age":65,"emails":["ga@latcon.tr","wur@helmawak.im","ovpifuva@gabruzup.vc"]}
{"name":"Gary Allison","age":30,"emails":["wiko@unuwudu.za","fog@zokje.sh","juppojer@jadi.tl"]}
```

You can also specify a JSON file instead of a JSON string:
```
mgenerate template.json -n 5
```


## Template Syntax

The input string or file must be valid JSON, with one exception: As a convenience, from version 0.3.0 onwards, it's ok to omit quotes around keys, so both these templates are equivalent:

```
{"name": "$name"}
{name: "$name"}
```

### Shape of objects

The output has the same shape as the input template (including nested keys), with
one exception: If a key is assigned the special value `$missing`, then the
key is not present in the output (see `$missing` below for an example).


### Values

All values are taken literally, except for special `$`-prefixed values. These
values are called "operators". A list of operators can be found below.

Operators are used either in string or object format. The string format is
a shortcut to call the operator with default options.

String format:

```
{"key": "$operator"}
```

Object format:

```
{"key": {"$operator": { <additional options> }}}
```

Most operators have sensible default values that are used for their string format.

Example: `$year`

```
mgeneratejs '{"born_in": "$year"}' -n 5
```
```
{"born_in":"2035"}
{"born_in":"2086"}
{"born_in":"2088"}
{"born_in":"2022"}
{"born_in":"2082"}
```

The object format allows to pass in additional options to the operator,
here, a minimum and maximum for the value:

```
mgeneratejs '{"born_in": {"$year": {"min": 1930, "max": 1970}}}'
```
```
{"born_in":"1936"}
{"born_in":"1953"}
{"born_in":"1964"}
{"born_in":"1932"}
{"born_in":"1943"}
```

See the definition of the operator for its default values.

### Combining Operators

Operators can be combined, where the result of one operator is passed in as
an option to another operator.

Example: Here we pass in a random number between 0 and 5 to the `number` option
of the `$array` operator to generate variable-length arrays.

```
mgeneratejs '{"ip_addresses": {"$array": {"of": "$ip", "number": {"$integer": {"min": 0, "max": 5}}}}}'
```
```
{"ip_addresses":["166.182.72.83","127.94.56.191","236.79.131.157","94.66.121.242"]}
{"ip_addresses":["48.227.145.186","160.173.45.84","24.86.124.235"]}
{"ip_addresses":[]}
{"ip_addresses":["21.45.212.198"]}
{"ip_addresses":["199.209.162.241"]}
```

## Built-in Operators

#### General

- [`$array`](#array): Creates an array of values.
- [`$choose`](#choose): Chooses one element from an array of possible choices.
- [`$inc`](#inc): Generates natural numbers in increasing order.
- [`$join`](#join): Joins elements of an array to a string.
- [`$pick`](#pick): Returns an element from an array.

#### Geospatial

- [`$coordinates`](#coordinates): Returns a pair of longitude/latitude coordinates.
- [`$point`](#point): Returns a GeoJSON Point.
- [`$linestring`](#linestring): Returns a GeoJSON LineString.
- [`$polygon`](#polygon): Returns a GeoJSON Polygon.
- [`$geometries`](#geometries): Returns a GeoJSON GeometryCollection.

#### Native and MongoDB-specific Types

- [`$binary`](#binary): Returns a MongoDB Binary type.
- [`$date`](#date): Returns a random date, optionally in a given range.
- [`$now`](#now): Returns the current date.
- [`$maxkey`](#maxkey): Returns a MongoDB MaxKey object.
- [`$minkey`](#minkey): Returns a MongoDB MinKey object.
- [`$numberDecimal`](#numberdecimal): Returns a MongoDB Decimal128 number.
- [`$numberLong`](#numberlong): Returns a MongoDB Long (Int64) number.
- [`$objectid`](#objectid): Returns MongoDB ObjectID.
- [`$regex`](#regex): Returns a Regular Expression object.
- [`$timestamp`](#timestamp): Returns a MongoDB Timestamp.


### All Built-in Operators in Alphabetical Order

### `$array`

Creates an array of values. Each new element is evaluated separately.

_Options_
- `of` (required) Defines an element of the array. Operators are evaluated separately for each element.
- `number` (optional) Number of elements. Default `0`.

> **Example**
>
> ```
> {"countries": {"$array": {"of": {"$country": {"full": true}}, "number": 3}}}
> ```
>
> Creates an array of 3 countries, e.g. `{"countries":["Czech Republic","Ireland","Argentina"]}`


### `$binary`

Returns a random MongoDB Binary value, optionally with a `length` and `subtype`.

_Options_
- `length` (optional) Length in bytes of binary value. Default `10`.
- `subtype` (optional) Specific binary subtype (see [BSON spec][bson-spec]). Default `0`.

> **Example**
>
> ```
> {"blob": "$binary"}
> ```
>
> Returns a Binary object (stringified to extended JSON on stdout).
> e.g. `{"blob":{"$binary":"TzhXcFZoRllRNg==","$type":"0"}}`.


### `$choose`

Chooses one element from an array of possible choices with uniform probability.
Optionally chooses with probability proportional to a provided `weights` array.

_Options_
- `from` (required) Array of values or operators to choose from.
- `weights` (optional) Number of elements. Default `0`.

> **Example**
>
> ```
> {"status": {"$choose": {"from": ["read", "unread", "deleted"], "weights": [2, 1, 1]}}}
> ```
>
> Returns `{"status": "read"}` with probability 1/2, and `{"status": "unread"}` and
> `{"status": "deleted"}` each with probability 1/4.


### `$coordinates`

Returns a 2-element array of longitude/latitude coordinates, optionally within
`long_lim` and/or `lat_lim` bounds.

_Aliases_
- `$coord`
- `$coordinate`

_Options_
- `long_lim` (optional) Array of longitude bounds. Default `[-180, 180]`.
- `lat_lim` (optional) Array of latitude bounds. Default `[-90, 90]`.

> **Example**
>
> ```
> {"position": {"$coordinates": {"long_lim": [-20, -19]}}}
> ```
>
> Returns a pair of coordinates with the longitude bounds between -20 and -19,
> e.g. `{"position":[-19.96851,-47.46141]}`.


### `$date`

Returns a random date object, optionally between specified `min` and `max` values.
If `min` and/or `max` are provided, they need to be in a format that [Date.parse()][date-parse]
can read, e.g. ISO-8601.

_Aliases_
- `$datetime`

_Options_
- `min` (optional) Minimum date, as parseable string.
- `max` (optional) Maximum date, as parsable string.

> **Example**
>
> ```
> {"last_login": {"$date": {"min": "2015-01-01", "max": "2016-12-31T23:59:59.999Z"}}}
> ```
>
> Returns a random date and time between 2015 and 2016 (incl.), e.g.
> `{"last_login":{"$date":"2016-06-28T15:28:54.721Z"}}`.


### `$now`

Returns the current date at creation time. Ideal for time-stamping documents.

_Options_
_none_

> **Example**
>
> ```
> {"created": "$now"}
> ```
>
> Returns the extended JSON date and time at creation.
> `{"created":{"$date":"2017-02-20T04:44:24.880Z"}}`.

### `$geometries`

Returns a GeoJSON formatted [GeometryCollection](http://geojson.org/geojson-spec.html#geometrycollection)
with `number` geometries. By default, the geometries are chosen from `Point`,
`LineString` and `Polygon`. A subset of types can be specified with the `types`
option.

Additional options are passed onto each geometry, e.g. `corners` is passed
to polygons, `locs` is passed to line strings.

optionally within `long_lim` and/or
`lat_lim` bounds. The last point in the `coordinates` array closes the polygon
and does not count towards the number of corners.

_Options_
- `number` (optional) Number of geometries in the collection. Default `3`.
- `types` (optional) Types of geometries to choose from. Default `["Point", "LineString", "Polygon"]`.
- `locs` (optional) Number of locations in a line string. Default `2`.
- `corners` (optional) Number of corners in a polygon. Default `3`.
- `long_lim` (optional) Array of longitude bounds. Default `[-180, 180]`.
- `lat_lim` (optional) Array of latitude bounds. Default `[-90, 90]`.

> **Example**
>
> ```
> {"triangles": {"$geometries": {"types": ["Polygon"], "corners": 3, "number": 4}}}
> ```
>
> Returns a GeoJSON GeometryCollection with 4 triangles.
> ```
> {
>   "triangles": {
>     "type": "GeometryCollection",
>     "geometries": [
>       {
>         "coordinates": [[[39.3259,-16.71813],[172.02089,-14.75681],[61.97122,-1.4036],[39.3259,-16.71813]]],
>         "type": "Polygon"
>       },
>       {
>         "coordinates": [[[57.66865,-18.3085],[-48.81722,-40.64912],[-145.11102,32.8189],[57.66865,-18.3085]]],
>         "type": "Polygon"
>       },
>       {
>         "coordinates": [[[110.68379,28.31158],[-73.67573,-19.54736],[-73.29514,52.07583],[110.68379,28.31158]]],
>         "type": "Polygon"
>       },
>       {
>         "coordinates": [[[-29.36382,79.19853],[138.84298,7.43148],[176.28313,36.83292],[-29.36382,79.19853]]],
>         "type": "Polygon"
>       }
>     ]
>   }
> }
> ```


### `$inc`

Generate natural numbers in increasing order.

_Options_
- `start` (optional) starts counting at this value. Default `0`.
- `step` (optional) increases by this amount each time. Default `1`. Can also take negative value.

> **Example**
>
> ```
> {"even_numbers": {"$inc": {"start": 0, "step": 2}}}
> ```
>
> Assigns the numbers 0, 2, 4, 6, ... to subsequent objects.


### `$join`

Takes an array `array` and a separator string `sep` and joins the elements
of the array (each cast to string) separated by `sep`. The default separator
is the empty string ''.

_Options_
- `array` (required) Array of values to be joined (cast to string).
- `sep` (optional) Separator string. Default `''` (empty string).

> **Example**
>
> ```
> {"code": {"$join": {"array": ["foo", "bar", "baz"], "sep": "-"}}}
> ```
>
> Returns `{"code": "foo-bar-baz"}`.


### `$linestring`

Returns a GeoJSON formatted [LineString](http://geojson.org/geojson-spec.html#id3)
with optionally `locs` locations and within `long_lim` and/or `lat_lim` bounds.

_Options_
- `locs` (optional) Number of locations in the line string. Default `2`.
- `long_lim` (optional) Array of longitude bounds. Default `[-180, 180]`.
- `lat_lim` (optional) Array of latitude bounds. Default `[-90, 90]`.

> **Example**
>
> ```
> {"line": "$linestring"}
> ```
>
> Returns a GeoJSON line string with 2 locations,
> e.g. `{"line":{"type":"LineString","coordinates":[[35.67106,-41.9745],[120.07739,68.46491]]}}`.


### `$maxkey`

Returns the MongoDB MaxKey value.


> **Example**
>
> ```
> {"upper_bound": "$maxkey"}
> ```
>
> Returns `{"upper_bound":{"$maxKey":1}}`.


### `$minkey`

Returns the MongoDB MinKey value.


> **Example**
>
> ```
> {"lower_bound": "$minkey"}
> ```
>
> Returns `{"lower_bound":{"$minKey":1}}`.


### `$numberDecimal`

Returns a MongoDB Decimal128 number.

_Options_
- `min` (optional) minimum value. Default `0`.
- `max` (optional) maximum value. Default `1000`.
- `fixed` (optional) number of digits after the decimal. Default `2`.

> **Example**
>
> ```
> {"price": {"$numberDecimal": {"fixed": 3}}}
> ```
>
> Returns `{"price":{"$numberDecimal": "1545.241"}}`.


### `$numberLong`

Returns a MongoDB Long (Int64) number.

_Options_
- `min` (optional) minimum value. Default `-2^53`.
- `max` (optional) maximum value. Default `2^53`.

> **Example**
>
> ```
> {"price": {"$numberLong": {"min": 100000}}}
> ```
>
> Returns `{"price":{"$numberLong":"7624790980443125"}}`.


### `$objectid`

Returns a new MongoDB ObjectId.

_Aliases_

- `$oid`


> **Example**
>
> ```
> {"_id": "$objectid"}
> ```
>
> Returns `{"_id":{"$oid":"574ac75f725f4447309ab587"}}`.


### `$pick`

Takes an array and a number `element` and returns the `element`-th value of
the array. If the number is larger than the length of the array, return
`$missing` instead, which will remove the key from the resulting document.
`element` is zero-based (`0` returns the first element).

_Options_
- `array` (required) Array of values or operators to choose from.
- `element` (optional) Index of the array element to pick. Default `0`.

> **Example**
>
> ```
>  {"color": {"$pick": {"array": ["green", "red", "blue"], "element": 1}}}
> ```
>
> Returns `{"color": "red"}`.


### `$point`

Like `$coordinates`, but returns a GeoJSON formatted
[Point](http://geojson.org/geojson-spec.html#id2), optionally within
`long_lim` and/or `lat_lim` bounds.

_Options_
- `long_lim` (optional) Array of longitude bounds. Default `[-180, 180]`.
- `lat_lim` (optional) Array of latitude bounds. Default `[-90, 90]`.

> **Example**
>
> ```
> {"position": {"$point": {"long_lim": [-20, -19]}}}
> ```
>
> Returns a GeoJSON Point with the longitude bounds between -20 and -19,
> e.g. `{"position": {"type": "Point", "coordinates": [-19.96851,-47.46141]}}`.

linestring: require('./linestring'),
polygon: require('./polygon'),
geometries: require('./geometries'),


### `$polygon`

Returns a GeoJSON formatted [Polygon](http://geojson.org/geojson-spec.html#id4)
(without holes) with `corners` corners, optionally within `long_lim` and/or
`lat_lim` bounds. The last point in the `coordinates` array closes the polygon
and does not count towards the number of corners.

_Options_
- `corners` (optional) Number of corners in the polygon. Default `3`.
- `long_lim` (optional) Array of longitude bounds. Default `[-180, 180]`.
- `lat_lim` (optional) Array of latitude bounds. Default `[-90, 90]`.

> **Example**
>
> ```
> {"area": {"$polygon": {"corners": 5}}}
> ```
>
> Returns a GeoJSON polygon with 5 corners,
> e.g. `{"area":{"type":"Polygon","coordinates":[[[-75.26507,81.14973],[-12.29368,64.22995],[60.43231,-15.97496],[-133.6566,-40.40259],[-130.31348,-87.36982],[-75.26507,81.14973]]]}}`.


### `$regex`

Returns a [RegExp][regexp] object.

_Options_

- `string` (optional) The regular expression string. Default `'.*'`.
- `flags` (optional) Flags for the RegExp object. Default `''`.

> **Example**
>
> ```
> {"expr": {"$regex": {"string": "^ab+c$", "flags": "i"}}}
> ```
>
> Returns `{"expr":{"$regex":"^ab+c$","$options":"i"}}`.



### `$timestamp`

Returns a MongoDB Timestamp object.

_Options_

- `t` (optional) Set the low value to the specified value. Default random.
- `i` (optional) Set the high value to the specified value. Default random.


> **Example**
>
> ```
> {"ts": {"$timestamp": {"t": 10, "i": 20}}}
> ```
>
> Returns `{"ts":{"$timestamp":{"t":10,"i":20}}}`.


## Chance.js

All other `$`-prefixed strings that don't match any of the built-in operators above
are passed on to the [chance.js][chance-js] library. Use the string format for
default options, or pass in custom options with the object format.

Some Examples:

```
{"ip_address": "$ip"}
{"percent": {"$floating": {"min": 0, "max": 100, "fixed": 8}}}
{"birthday": {"$birthday": {"type": "child"}}}
{"phone_no": "$phone"}
{"full_name": {"$name": {"gender": "female"}}}
```

## Advanced Templates

TBD.

In short, you can use handlebar template strings to build even more complex
values, e.g.

```
mgeneratejs '{"recipient": "{{chance.name()}} <{{chance.email()}}>"}' -n 3
```
```
{"recipient":"Lora Jimenez <muwer@oma.qa>"}
{"recipient":"Elnora Brewer <wisnowaz@vacpar.tg>"}
{"recipient":"Howard Bryan <jo@vemoriw.sd>"}
```

## Difference to mtools' mgenerate script

This is a Javascript port from the [mgenerate][mgenerate-mtools] script in the
[mtools][mtools] library (of which I am also the author). It is mostly backwards
compatible except for the following breaking changes:  

1. The "array" operator format is no longer supported, as it was confusing
which arguments need to be provided in which order. Instead, use the "object"
format with named options. See [array shortcut syntax][array-syntax].
2. The "$concat" operator has been renamed to "$join", as this operation is
called "join" in many languages, e.g. Python and Javascript. "$concat" is
reserved for a future operator to concatenate arrays.
3. mgeneratejs does not insert documents directly into MongoDB, it only outputs
to stdout. It doesn't make sense to re-implement all the authentication options
separately, when the resulting objects can simply be piped to mongoimport.

In addition, many more operators are supported through the inclusion of
the chance.js library, and the extended template syntax with handlebar templates.


## License

Apache 2.0

[mgenerate-mtools]: https://github.com/rueckstiess/mtools/wiki/mgenerate
[array-syntax]: https://github.com/rueckstiess/mtools/wiki/mgenerate#parsing-the-json-document
[mtools]: https://github.com/rueckstiess/mtools/
[chance-js]: http://chancejs.com/
[regexp]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[bson-spec]: http://bsonspec.org/spec.html
[date-parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
[travis_img]: https://img.shields.io/travis/rueckstiess/mgeneratejs.svg
[travis_url]: https://travis-ci.org/rueckstiess/mgeneratejs
[npm_img]: https://img.shields.io/npm/v/mgeneratejs.svg
[npm_url]: https://npmjs.org/package/mgeneratejs
