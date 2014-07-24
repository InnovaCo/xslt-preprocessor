<?xml version="1.0"?>
<!ENTITIES "entities.dtd" [
	<!ENTITY custom.tags "balloon">
]>
<stylesheet use="exsl common dyn">
	<!-- Подключение шаблонов -->
	<output method="html"/>

	<template match="/document">
		<!-- Проверка правильности вывода результата в XML -->
		<link rel="stylesheet" href="test.css"/>
		<!-- Генерация элемента (инлайн) -->
		<div 
			id="{@id?}"
			id2="{@id if contains(@id, 'foo')}"
			class="{@mod1?, @mod2 if @mod &gt; 2}"
			>
		</div>

		<div>
			<attribute name="extra1" value="{@id?}"/>
			<attribute name="extra2" if="@id?">...</attribute>
			<attribute name="extra3" value="a" if="b"/>
			<attribute-set select="a: 'test', b: @mod1" prefix="data-"/>
		</div>

		<h2>{{ foo/bar }}</h2>
		<p if="@id?">output</p>
		<p if="@foo?">no output</p>

		<!-- Итератор по числовому ряду -->
		<for var="i" from="0" to="@mod">
			<div>value {{$i}}</div>
		</for>

		<!-- Вызов шаблона -->
		<apply-templates select="foo/bar" 
			params="p1: @id, p2: value2?">
			<!--
			params="node-set" — передаст набор параметров в шаблон, определённых в node-set. Название нода будет названием параметра, значение нода —
			значением параметра
			-->
		</apply-templates>
	</template>

	<template match="bar">
		<param name="p1"/>
		<param name="p2"/>
		<p>param1: {{ $p1 }}</p>
		<p>param2: {{ $p2 }}</p>
		<p>param2 (2): "{{ $p2 }}"</p>

		<![CDATA[ <hello !> ]]>
	</template>
</stylesheet>