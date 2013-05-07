<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:output method="xml" encoding="UTF-8" indent="yes" />

<xsl:strip-space elements="*"/>
<xsl:preserve-space elements="pre"/>

<xsl:template match="/">
    <xsl:apply-templates />
</xsl:template>

<xsl:template match="div[@title='docbookArticle']">
    <article id="{@id}">
        <xsl:apply-templates />
    </article>
</xsl:template>

<xsl:template match="h1[@title='docbookArticleTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="div[@title='docbookSection']">
    <section id="{@id}">
        <xsl:apply-templates />
    </section>
</xsl:template>

<xsl:template match="h2[@title='docbookSectionTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="h3[@title='docbookSectionTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="h4[@title='docbookSectionTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="h5[@title='docbookSectionTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="table[@title='docbookInformaltable']">
    <informaltable tabstyle="{@tabstyle}" frame="{@frame}">
      <tgroup cols="{@cols}">
        <xsl:apply-templates />
      </tgroup>
    </informaltable>
</xsl:template>

<xsl:template match="table[@title='docbookTable']">
    <table tabstyle="{@tabstyle}" frame="{@frame}">
      <tgroup cols="{@cols}">
        <xsl:apply-templates />
      </tgroup>
    </table>
</xsl:template>

<xsl:template match="tbody">
    <tbody>
        <xsl:apply-templates />
    </tbody>
</xsl:template>

<xsl:template match="tr[not(@class='thead')]">
    <row rowsep="{@rowsep}">
        <xsl:apply-templates />
    </row>
</xsl:template>

<xsl:template match="tr[@class='thead']">
        <xsl:apply-templates />
</xsl:template>


<xsl:template match="td">
    <entry>
        <xsl:apply-templates />
    </entry>
</xsl:template>

<xsl:template match="thead">
    <xsl:apply-templates />
</xsl:template>


<xsl:template match="th[@colname]">
    <colspec colname="{@colname}" colsep="{@colsep}" colwidth="{@colwidth}" />
</xsl:template>

<xsl:template match="p[@title='docbookStreet']">
    <street>
        <xsl:apply-templates />
    </street>
    <xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="p[@title='docbookCity']">
    <city>
        <xsl:apply-templates />
    </city>
</xsl:template>

<xsl:template match="p[@title='docbookState']">
    <state>
        <xsl:apply-templates />
    </state>
</xsl:template>

<xsl:template match="p[@title='docbookPostcode']">
    <xsl:text>&#160;</xsl:text>
    <postcode>
        <xsl:apply-templates />
    </postcode>
    <xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="p[@title='docbookAffiliation']">
    <xsl:text>&#10;</xsl:text>
    <affiliation>
        <xsl:apply-templates />
    </affiliation>
    <xsl:text>&#10;</xsl:text>
</xsl:template>


<xsl:template match="div[@title='docbookAddress']">
    <address>
        <xsl:apply-templates />
    </address>
</xsl:template>



<xsl:template match="p[@title='docbookPara']">
    <para>
        <xsl:apply-templates />
    </para>
</xsl:template>

<xsl:template match="div[@title='docbookNote']">
    <note>
        <xsl:apply-templates />
    </note>
</xsl:template>

<xsl:template match="h2[@title='docbookNoteTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="div[@title='docbookImportant']">
    <important>
        <xsl:apply-templates />
    </important>
</xsl:template>

<xsl:template match="h2[@title='docbookImportantTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="div[@title='docbookWarning']">
    <warning>
        <xsl:apply-templates />
    </warning>
</xsl:template>

<xsl:template match="h2[@title='docbookWarningTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="div[@title='docbookItemizedList']">
    <itemizedlist>
        <xsl:apply-templates />
    </itemizedlist>
</xsl:template>

<xsl:template match="p[@title='docbookItemizedListTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="ul[@title='docbookItemizedListContainer']">
    <xsl:apply-templates />
</xsl:template>

<xsl:template match="div[@title='docbookOrderedList']">
    <orderedlist>
        <xsl:apply-templates />
    </orderedlist>
</xsl:template>

<xsl:template match="p[@title='docbookOrderedListTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="ol[@title='docbookOrderedListContainer']">
    <xsl:apply-templates />
</xsl:template>

<xsl:template match="li[@title='docbookListItem']">
    <listitem>
        <xsl:apply-templates />
    </listitem>
</xsl:template>

<xsl:template match="div[@title='docbookProcedure']">
    <procedure>
        <xsl:apply-templates />
    </procedure>
</xsl:template>

<xsl:template match="p[@title='docbookProcedureTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="ol[@title='docbookProcedureContainer']">
    <xsl:apply-templates />
</xsl:template>

<xsl:template match="li[@title='docbookStep']">
    <step>
        <xsl:apply-templates />
    </step>
</xsl:template>

<xsl:template match="pre[@title='docbookScreen']">
<screen>
<xsl:apply-templates />
</screen>
</xsl:template>



<!-- ********************** -->
<!-- Inline tags below this -->
<!-- ********************** -->

<xsl:template match="a[@title='docbookXref']">
    <xsl:variable name="linkend" select="@linkend" />
    <xref linkend="{$linkend}">
        <xsl:apply-templates />
    </xref>
</xsl:template>

<xsl:template match="span[@title='docbookSGMLTag']">
    <xsl:variable name="classname" select="substring(@class, 9)" />
    <sgmltag class="{$classname}">
        <xsl:apply-templates />
    </sgmltag>
</xsl:template>

<xsl:template match="span[@title='docbookEmphasis']">
    <emphasis>
        <xsl:apply-templates />
    </emphasis>
</xsl:template>

<xsl:template match="code[@title='docbookFileName']">
    <filename>
        <xsl:apply-templates />
    </filename>
</xsl:template>

<xsl:template match="code[@title='docbookClassName']">
    <classname>
        <xsl:apply-templates />
    </classname>
</xsl:template>

<xsl:template match="code[@title='docbookConstant']">
    <constant>
        <xsl:apply-templates />
    </constant>
</xsl:template>

<xsl:template match="code[@title='docbookFunction']">
    <function>
        <xsl:apply-templates />
    </function>
</xsl:template>

<xsl:template match="code[@title='docbookParameter']">
    <parameter>
        <xsl:apply-templates />
    </parameter>
</xsl:template>

<xsl:template match="code[@title='docbookReplaceable']">
    <replaceable>
        <xsl:apply-templates />
    </replaceable>
</xsl:template>

<xsl:template match="code[@title='docbookVarname']">
    <varname>
        <xsl:apply-templates />
    </varname>
</xsl:template>

<xsl:template match="code[@title='docbookStructfield']">
    <structfield>
        <xsl:apply-templates />
    </structfield>
</xsl:template>

<xsl:template match="code[@title='docbookSystemItem']">
    <systemitem>
        <xsl:apply-templates />
    </systemitem>
</xsl:template>

<xsl:template match="span[@title='docbookPackage']">
    <package>
        <xsl:apply-templates />
    </package>
</xsl:template>

<xsl:template match="span[@title='docbookCommand']">
    <command>
        <xsl:apply-templates />
    </command>
</xsl:template>

<xsl:template match="span[@title='docbookOption']">
    <option>
        <xsl:apply-templates />
    </option>
</xsl:template>

<xsl:template match="code[@title='docbookUserInput']">
    <userinput>
        <xsl:apply-templates />
    </userinput>
</xsl:template>

<xsl:template match="code[@title='docbookComputerOutput']">
    <computeroutput>
        <xsl:value-of select="." />
    </computeroutput>
</xsl:template>

<xsl:template match="code[@title='docbookPrompt']">
    <prompt>
        <xsl:value-of select="." />
    </prompt>
</xsl:template>

<xsl:template match="sup">
    <superscript>
        <xsl:value-of select="." />
    </superscript>
</xsl:template>

<xsl:template match="sub">
    <subscript>
        <xsl:value-of select="." />
    </subscript>
</xsl:template>

</xsl:stylesheet>
