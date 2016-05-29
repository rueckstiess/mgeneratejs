# mgeneratejs [![travis][travis_img]][travis_url] [![npm][npm_img]][npm_url]

_mgeneratejs_ generates structured, semi-random JSON data according to a
template object. It offers both a command line script and a Javascript API.


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

## Template Syntax

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

### List of Built-in Operators

#### General Operators

#### `$inc`

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

#### `$array`

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


#### `$choose`

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



##### $pick
##### $join
##### $inc
##### $date

#### Geospatial Operators

#### MongoDB Native Types

### Chance.js

## License

Apache 2.0

[travis_img]: https://img.shields.io/travis/rueckstiess/mgeneratejs.svg
[travis_url]: https://travis-ci.org/rueckstiess/mgeneratejs
[npm_img]: https://img.shields.io/npm/v/mgeneratejs.svg
[npm_url]: https://npmjs.org/package/mgeneratejs
