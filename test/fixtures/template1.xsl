<?xml version="1.0"?>
<!DOCTYPE xsl:stylesheet SYSTEM "entities.dtd" [
	<!ENTITY custom.tags "balloon">
]>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:date="http://exslt.org/dates-and-times" xmlns:dyn="http://exslt.org/dynamic" xmlns:exsl="http://exslt.org/common" xmlns:common="http://exslt.org/common" xmlns:func="http://exslt.org/functions" xmlns:math="http://exslt.org/math" xmlns:random="http://exslt.org/random" xmlns:regexp="http://exslt.org/regular-expressions" xmlns:set="http://exslt.org/sets" xmlns:str="http://exslt.org/strings" extension-element-prefixes="date dyn exsl common func math random regexp set str">
	<!-- Подключение шаблонов -->
	<xsl:output method="html"></xsl:output>

	<xsl:template match="/document">
		<!-- Генерация элемента (инлайн) -->
		<div><xsl:variable name="__x_attr_id"><xsl:if test="@id"><token><xsl:value-of select="@id"></xsl:value-of></token></xsl:if></xsl:variable><xsl:call-template name="__x_attribute">
<xsl:with-param name="name" select="'id'"></xsl:with-param><xsl:with-param name="nodeset" select="exsl:node-set($__x_attr_id)"></xsl:with-param><xsl:with-param name="glue" select="' '"></xsl:with-param></xsl:call-template><xsl:variable name="__x_attr_id2"><xsl:if test="contains(@id, 'foo')"><token><xsl:value-of select="@id"></xsl:value-of></token></xsl:if></xsl:variable><xsl:call-template name="__x_attribute">
<xsl:with-param name="name" select="'id2'"></xsl:with-param><xsl:with-param name="nodeset" select="exsl:node-set($__x_attr_id2)"></xsl:with-param><xsl:with-param name="glue" select="' '"></xsl:with-param></xsl:call-template><xsl:variable name="__x_attr_class"><xsl:if test="@mod1"><token><xsl:value-of select="@mod1"></xsl:value-of></token></xsl:if>
<xsl:if test="@mod &gt; 2"><token><xsl:value-of select="@mod2"></xsl:value-of></token></xsl:if></xsl:variable><xsl:call-template name="__x_attribute">
<xsl:with-param name="name" select="'class'"></xsl:with-param><xsl:with-param name="nodeset" select="exsl:node-set($__x_attr_class)"></xsl:with-param><xsl:with-param name="glue" select="' '"></xsl:with-param></xsl:call-template>
		</div>

		<div>
			<xsl:call-template name="__x_add_attribute"><xsl:with-param name="name">extra1</xsl:with-param><xsl:with-param name="value"><xsl:if test="normalize-space(@id)"><xsl:value-of select="@id"></xsl:value-of></xsl:if></xsl:with-param></xsl:call-template>
			<xsl:if test="normalize-space(@id)"><xsl:attribute name="extra2">...</xsl:attribute></xsl:if>
			<xsl:if test="b"><xsl:call-template name="__x_add_attribute"><xsl:with-param name="name">extra3</xsl:with-param><xsl:with-param name="value"><xsl:text>a</xsl:text></xsl:with-param></xsl:call-template></xsl:if>
			<xsl:variable name="__x_attribute_set"><a><xsl:value-of select="'test'"></xsl:value-of></a>
<b><xsl:value-of select="@mod1"></xsl:value-of></b></xsl:variable><xsl:call-template name="__x_add_attribute_set"><xsl:with-param name="nodeset" select="exsl:node-set($__x_attribute_set)"></xsl:with-param><xsl:with-param name="prefix">data-</xsl:with-param></xsl:call-template>
		</div>

		<h2><xsl:value-of select="foo/bar"/></h2>
		<xsl:if test="normalize-space(@id)"><p>output</p></xsl:if>
		<xsl:if test="normalize-space(@foo)"><p>no output</p></xsl:if>

		<!-- Итератор по числовому ряду -->
		<xsl:call-template name="__x_for_1a750944-934f-4795-954e-71e036362436">
	<xsl:with-param name="__x_to" select="number(@mod)"></xsl:with-param>
	<xsl:with-param name="i" select="number(0)"></xsl:with-param>
	</xsl:call-template>

		<!-- Вызов шаблона -->
		<xsl:apply-templates select="foo/bar"><xsl:with-param name="p1"><xsl:value-of select="@id"></xsl:value-of></xsl:with-param>
<xsl:with-param name="p2"><xsl:if test="normalize-space(value2)"><xsl:value-of select="value2"></xsl:value-of></xsl:if></xsl:with-param>
			<!--
			params="node-set" — передаст набор параметров в шаблон, определённых в node-set. Название нода будет названием параметра, значение нода —
			значением параметра
			-->
		</xsl:apply-templates>
	</xsl:template>

	<xsl:template match="bar">
		<xsl:param name="p1"></xsl:param>
		<xsl:param name="p2"></xsl:param>
		<p>param1: <xsl:value-of select="$p1"/></p>
		<p>param2: <xsl:value-of select="$p2"/></p>
		<p>param2 (2): "<xsl:value-of select="$p2"/>"</p>

		<![CDATA[ <hello !> ]]>
	</xsl:template>
<xsl:template name="__x_for_1a750944-934f-4795-954e-71e036362436">
		<xsl:param name="__x_to" select="number(0)"></xsl:param>
		<xsl:param name="i" select="number(0)"></xsl:param>
		<xsl:if test="$i &lt; $__x_to">
		
			<div>value <xsl:value-of select="$i"/></div>
				<xsl:call-template name="__x_for_1a750944-934f-4795-954e-71e036362436">
		<xsl:with-param name="__x_to" select="$__x_to"></xsl:with-param>
		<xsl:with-param name="i" select="number($i + 1)"></xsl:with-param>
		</xsl:call-template>
		</xsl:if>
		</xsl:template>

	<!-- === XSLT preprocessor standard templates === -->
	<!-- Create normalized attribute only if value is not empty -->
	<xsl:template name="__x_add_attribute">
		<xsl:param name="name"></xsl:param>
		<xsl:param name="value"></xsl:param>
		<xsl:variable name="attr-value">
			<xsl:value-of select="normalize-space($value)"></xsl:value-of>
		</xsl:variable>
		
		<xsl:if test="string($attr-value)">
			<xsl:attribute name="{$name}">
				<xsl:value-of select="$attr-value"></xsl:value-of>
			</xsl:attribute>
		</xsl:if>
	</xsl:template>

	<xsl:template name="__x_attribute">
		<xsl:param name="name"></xsl:param>
		<xsl:param name="nodeset"></xsl:param>
		<xsl:param name="glue" select="' '"></xsl:param>

		<xsl:if test="$nodeset">
			<xsl:call-template name="__x_add_attribute">
				<xsl:with-param name="name" select="$name"></xsl:with-param>
				<xsl:with-param name="value">
					<xsl:apply-templates select="$nodeset/*" mode="__x_attribute_value">
						<xsl:with-param name="glue" select="$glue"></xsl:with-param>
					</xsl:apply-templates>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="string" mode="__x_attribute_value">
		<xsl:param name="glue" select="''"></xsl:param>
		<xsl:value-of select="."></xsl:value-of>
	</xsl:template>

	<xsl:template match="token" mode="__x_attribute_value">
		<xsl:param name="glue" select="''"></xsl:param>
		<xsl:if test="name(preceding-sibling::*[1]) = 'token'">
			<xsl:value-of select="$glue"></xsl:value-of>
		</xsl:if>
		<xsl:value-of select="."></xsl:value-of>
	</xsl:template>

	<!-- Creates attributes from given nodeset -->
	<xsl:template name="__x_add_attribute_set">
		<xsl:param name="nodeset"></xsl:param>
		<xsl:param name="prefix" select="''"></xsl:param>
		<xsl:for-each select="$nodeset/*">
			<xsl:call-template name="__x_add_attribute">
				<xsl:with-param name="name" select="concat($prefix, name())"></xsl:with-param>
				<xsl:with-param name="value" select="."></xsl:with-param>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>

</xsl:stylesheet>