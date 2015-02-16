var BloomFilter = function(m , k) {

  this._storage = Array(m);
  for (i = 0; i < this._storage.length; i++)
    this._storage[i] = false;

  //simulates k different hash functions
  this._codes = Array(k);
  for (var i = 0; i < this._codes.length; i++)
    this._codes[i] = Math.random();
}

BloomFilter.prototype.add = function(item){
  var key = JSON.stringify(item);
  for (var i = 0; i < this._codes.length; i++)
  {
    this._storage[this._hash((key + this._codes[i]),
      this._storage.length)] = true;
  }
};

BloomFilter.prototype.contains = function(item){
  var ret = true;
  var key = JSON.stringify(item);
  for (var i = 0; i < this._codes.length; i++)
  {
    if (!this._storage[this._hash((key + this._codes[i]),
      this._storage.length)]) {
      ret = false;
    break;
  }
}
return ret;
};

BloomFilter.prototype.mapItem = function(item){
  var ret = [];
  ret.length = this._storage.length;
  for (i = 0; i < ret.length; i++)
    ret[i] = false;

  var key = JSON.stringify(item);
  for (var i = 0; i < this._codes.length; i++)
  {
    ret[this._hash((key + this._codes[i]),
      ret.length)] = true;
  }
  return ret;
};

BloomFilter.prototype._hash = function(str, max){
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = (hash<<5) + hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
    hash = Math.abs(hash);
  }
  return hash % max;
};

var testBloomFilter = function(m,k,n) {
  var filter, i, tests, elem;
  var count = 0, misses = 0;

  for (var trial = 0; trial < 100; trial++)
  {
    filter = new BloomFilter(m,k);
    tests = [];
    //populate bloom filter with n items
    for (i = 0; i < n; i++){
      elem = Math.random();
      tests.push(elem);
      filter.add(elem);
    }

    for(var t = 0; t < 1000; t++) {
   // tests
   var num = Math.random();
   var test = filter.contains(num);

   if (test)
    misses++;
  count++;
}
}
var error = misses / count;
var expectedError = Math.pow((1 - Math.exp(-1 * k * n / m)),k);
console.log('experimental error rate for m='+m+' k='+k+' n='+n+' is approx '+error+'\n');
console.log('expected error rate for m='+m+' k='+k+' n='+n+' is '+expectedError+ '\n');
console.log('percent diff = '+(error-expectedError)/expectedError);
};

