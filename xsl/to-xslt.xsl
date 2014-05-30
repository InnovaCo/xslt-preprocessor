<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:t="http://inn.ru/template">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" />

	<xsl:template match="/">
		<xsl:apply-templates select="." mode="xslt"/>
	</xsl:template>

	<xsl:template match="*" mode="xslt">
		<xsl:element name="{name()}">
			<xsl:apply-templates select="@*" mode="xslt"/>
			<xsl:apply-templates mode="xslt"/>
		</xsl:element>
	</xsl:template>

	<xsl:template match="@* | text()" mode="xslt">
		<xsl:copy-of select="."/>
	</xsl:template>

	<xsl:template match="t:style" mode="xslt">
		<xsl:element name="xsl:stylesheet">
			<xsl:apply-templates select="@*" mode="xslt"/>
			<xsl:apply-templates mode="xslt"/>
		</xsl:element>
	</xsl:template>

	<xsl:template match="t:import | t:include" mode="xslt">
		<xsl:element name="{concat('xsl:', local-name())}">
			<xsl:apply-templates select="@*" mode="xslt"/>
		</xsl:element>
	</xsl:template>

</xsl:stylesheet>