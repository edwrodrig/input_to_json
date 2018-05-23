QUnit.test( "basic usage", function( assert ) {
    let params = PAGE.params('hola?a=1');
    assert.propEqual(params, {a: "1"});
    assert.equal(Object.keys(params).length, 1);
});

QUnit.test( "param url", function( assert ) {
    let params = PAGE.params('hola?url=http://edwin.cl');
    assert.propEqual(params, {url: "http://edwin.cl"});
    assert.equal(Object.keys(params).length, 1);
});

QUnit.test( "two params", function( assert ) {
    let params = PAGE.params('hola?a=1&b=2');
    assert.propEqual(params, {a: "1", b: "2"});
    assert.equal(Object.keys(params).length, 2);
});

QUnit.test( "no params", function( assert ) {
    let params = PAGE.params('hola');
    assert.propEqual(params, {});
    assert.equal(Object.keys(params).length, 0);
});

QUnit.test( "one ignored param", function( assert ) {
    let params = PAGE.params('hola?a=1&b&c=3');
    assert.propEqual(params, {a: "1", c: "3"});
    assert.equal(Object.keys(params).length, 2);
});

QUnit.test( "param null", function( assert ) {
    let params = PAGE.params('hola?a=1&b=&c=3');
    assert.propEqual(params, {a: "1", b: "", c: "3"});
    assert.equal(Object.keys(params).length, 3);
});

QUnit.test( "param empty string", function( assert ) {
    let params = PAGE.params('');
    assert.propEqual(params, {});
    assert.equal(Object.keys(params).length, 0);
});

QUnit.test("plain type", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<div id='testid'>hello!</div>";
    let element = document.getElementById('testid');
    assert.equal('plain', ELEM.getType(element));
});

QUnit.test("img type", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<img id='testid' src='data:dfasdf'/>";
    let element = document.getElementById('testid');
    assert.equal('image', ELEM.getType(element));
});

QUnit.test("img type override", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<img id='testid' data-type='some' src='data:dfgadfasdf'/>";
    let element = document.getElementById('testid');
    assert.equal('some', ELEM.getType(element));
});

QUnit.test("img type override", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<img id='testid' data-type='some' src='data:asdfadasdf'/>";
    let element = document.getElementById('testid');
    assert.equal('some', ELEM.getType(element));
});

QUnit.test("text area type", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<textarea id='testid'></textarea><textarea/>";
    let element = document.getElementById('testid');
    assert.equal('input_text', ELEM.getType(element));
});

QUnit.test("input text type", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<input id='testid' type='text'>";
    let element = document.getElementById('testid');
    assert.equal('input_text', ELEM.getType(element));
});

QUnit.test("handle input text", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<input id='testid' type='text' value='none'>";

    let element = ELEM.get('testid');
    assert.equal('none', element.value);

    element.value = 'edwin';
    assert.equal('edwin', element.value);

    assert.equal('edwin', element.e.value);
});

QUnit.test("handle plain element", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<div id='testid'>none</div>";

    let element = ELEM.get('testid');
    assert.equal('none', element.value);

    element.value = 'edwin';
    assert.equal(element.value, 'edwin');

    assert.equal(element.e.innerHTML, 'edwin');
});

QUnit.test("handle object element", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = `
<div id="testid" data-type="object">
    <div data-name="full_name" data-type="object">
        <h1>Name</h1>
        <label>First name:</label><input type="text" name="name" value="Edwin"/><br/>
        <label>Surname:</label><input type="text" name="surname" value="Rodríguez"/><br/>
    </div>
    <label>Age:</label><input type="number" name="age" value="22"/><br/>
    <label>Best:</label><input type="checkbox" name="best" checked/><br/>
</div>
    `;

    let element = ELEM.get('testid');
    assert.propEqual(
        element.value,
        { full_name : { name: 'Edwin', surname: 'Rodríguez'}, age: 22, best: true}
        );

    element.value =  { full_name : { name: 'Some', surname: 'Surname'}, age: 30, best: false};

    assert.propEqual(element.value,  { full_name : { name: 'Some', surname: 'Surname'}, age: 30, best: false});

    assert.propEqual(
        element.getElement('full_name').value,
        { name: 'Some', surname: 'Surname'}
    );


});

QUnit.test("handle array element", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = `
<div id="testid" data-type="array" data-item-template-id="item-template">
</div>
<template id="item-template">
  <div data-type="object">
    <label>Name:</label><input type="text" name="name"/><br/>
    <label>Age:</label><input type="number" name="age"/>
  </div>
</template>
    `;

    let element = ELEM.get('testid');

    element.value =  [{name: 'Edwin', age: 99}, {name: 'Some', age: 20}];

    let values = element.value;
    assert.equal(values.length, 2);
    assert.propEqual(
        values[0],
        {name: 'Edwin', age: 99}
    );

    assert.propEqual(
        values[1],
        {name: 'Some', age: 20}
    );

    element.add({name: 'Other', age: 11});


    values = element.value;
    assert.equal(values.length, 3);

    assert.propEqual(
        values[0],
        {name: 'Edwin', age: 99}
    );

    assert.propEqual(
        values[1],
        {name: 'Some', age: 20}
    );

    assert.propEqual(
        values[2],
        {name: 'Other', age: 11}
    );

});

QUnit.test("text json type", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<textarea id='testid' data-type='json'>{\"name\": \"Edwin\"}</textarea>";
    let element = document.getElementById('testid');
    assert.equal('json', ELEM.getType(element));
    assert.propEqual(ELEM.get(element).value, {name: "Edwin"});
});

QUnit.test("handle custom element", function(assert) {
    let fixture = document.getElementById("qunit-fixture");
    fixture.innerHTML = "<input type='text' id='testid' data-type='wachulin' value='hola'/>";


    ELEM.type.wachulin = function(object) {
        Object.defineProperty(object, 'value', {
            get() {
                return this.e.value + this.e.value;
            },
            set(value) {
                this.e.value = value;
            }
        });
    };

    let element = ELEM.get('testid');


    assert.equal(element.value, 'holahola');
    element.value = 'chao';

    assert.equal(element.value, 'chaochao');
});

QUnit.test('request json ok', function(assert) {
    let done = assert.async();

    REQUEST.call('http://localhost:8888/echo_json_ok.php')
        .json({name: 'Edwin', surname: 'Rodriguez'})
        .success(function(e) {
            assert.propEqual(e, {name:'Edwin', surname: 'Rodriguez'});
            done();
        })
        .error(function(e) {
            assert.equal(1,2, 'This call should success');
            done();
        })
        .send();
});

QUnit.test('request json double success ok', function(assert) {
    let done = assert.async();

    REQUEST.call('http://localhost:8888/echo_json_ok.php')
        .json({name: 'Edwin', surname: 'Rodriguez'})
        .success(function(e) {
            assert.propEqual(e, {name:'Edwin', surname: 'Rodriguez'});
        })
        .success(function(e) {
            assert.propEqual(e, {name:'Edwin', surname: 'Rodriguez'});
            done();
        })
        .error(function(e) {
            assert.equal(1,2, 'This call should success');
            done();
        })
        .send();
});


QUnit.test('request form ok', function(assert) {
    let done = assert.async();

    REQUEST.call('http://localhost:8888/echo_form.php')
        .form({name: 'Edwin', surname: 'Rodriguez'})
        .success(function(e) {
            assert.propEqual(e, {name:'Edwin', surname: 'Rodriguez'});
            done();
        })
        .error(function(e) {
            assert.equal(1,2, 'This call should success');
            done();
        })
        .send();
});

QUnit.test('request json fail', function(assert) {
    let done = assert.async();

    REQUEST.call('http://localhost:8888/echo_json_fail.php')
        .json('some message')
        .success(function(e) {
            assert.equal(1,2, 'This call should fail');
            done();
        })
        .error(function(status, message) {
            assert.equal(-1, status);
            assert.equal('some message', message);
            done();
        })
        .send();
});

QUnit.test('request json internal server error', function(assert) {
    let done = assert.async();

    REQUEST.call('http://localhost:8888/echo_http_error.php')
        .json(500)
        .success(function(e) {
            assert.equal(1,2, 'This call should fail');
            done();
        })
        .error(function(status, message) {
            assert.equal(status, 500);
            assert.equal(message, "Internal Server Error");
            done();
        })
        .send();
});

QUnit.test('request json  not found', function(assert) {
    let done = assert.async();

    REQUEST.call('http://localhost:8888/echo_http_error.php')
        .json(404)
        .success(function(e) {
            assert.equal(1,2, 'This call should fail');
            done();
        })
        .error(function(status, message) {
            assert.equal(status, 404);
            assert.equal(message, "Not Found");
            done();
        })
        .send();
});

QUnit.test('request json wrong format', function(assert) {
    let done = assert.async();

    REQUEST.call('http://localhost:8888/echo_json_wrong_format.php')
        .json(404)
        .success(function(e) {
            assert.equal(1,2, 'This call should fail');
            done();
        })
        .error(function(status, message) {
            assert.equal(status, -1);
            assert.equal(message, "JSON.parse: unexpected character at line 1 column 1 of the JSON data");
            done();
        })
        .send();
});


QUnit.test('request json wrong success', function(assert) {
    let done = assert.async();

    REQUEST.call('http://localhost:8888/echo_json_ok.php')
        .json({name: 'Edwin', surname: 'Rodriguez'})
        .success(function(e) {
            throw "hola";
        })
        .error(function(status, message) {
            assert.equal(status, -1);
            assert.equal(message, 'hola');
            done();
        })
        .send();
});