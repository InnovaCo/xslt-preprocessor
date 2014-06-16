<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!-- Create normalized attribute only if value is not empty -->
	<xsl:template name="__x_add_attribute">
		<xsl:param name="name"/>
		<xsl:param name="value"/>
		<xsl:variable name="attr-value">
			<xsl:value-of select="normalize-space($value)"/>
		</xsl:variable>
		
		<xsl:if test="string($attr-value)">
			<xsl:attribute name="{$name}">
				<xsl:value-of select="$attr-value"/>
			</xsl:attribute>
		</xsl:if>
	</xsl:template>

	<xsl:template name="__x_attribute">
		<xsl:param name="name"/>
		<xsl:param name="nodeset"/>
		<xsl:param name="glue" select="' '"/>

		<xsl:if test="$nodeset">
			<xsl:call-template name="__x_add_attribute">
				<xsl:with-param name="name" select="$name"/>
				<xsl:with-param name="value">
					<xsl:apply-templates select="$nodeset/*" mode="__x_attribute_value">
						<xsl:with-param name="glue" select="$glue"/>
					</xsl:apply-templates>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<xsl:template match="string" mode="__x_attribute_value">
		<xsl:param name="glue" select="''"/>
		<xsl:value-of select="."/>
	</xsl:template>

	<xsl:template match="token" mode="__x_attribute_value">
		<xsl:param name="glue" select="''"/>
		<xsl:if test="name(preceding-sibling::*[1]) = 'token'">
			<xsl:value-of select="$glue"/>
		</xsl:if>
		<xsl:value-of select="."/>
	</xsl:template>

	<!-- Creates attributes from given nodeset -->
	<xsl:template name="__x_add_attribute_set">
		<xsl:param name="nodeset"/>
		<xsl:param name="prefix" select="''"/>
		<xsl:for-each select="$nodeset/*">
			<xsl:call-template name="__x_add_attribute">
				<xsl:with-param name="name" select="concat($prefix, name())"/>
				<xsl:with-param name="value" select="."/>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>

</xsl:stylesheet>