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