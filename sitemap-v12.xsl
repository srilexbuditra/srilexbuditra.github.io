<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
 xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
 exclude-result-prefixes="s image">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template name="last-segment">
  <xsl:param name="path"/>
  <xsl:choose>
    <xsl:when test="substring($path,string-length($path))='/'">
      <xsl:call-template name="last-segment"><xsl:with-param name="path" select="substring($path,1,string-length($path)-1)"/></xsl:call-template>
    </xsl:when>
    <xsl:when test="contains($path,'/')">
      <xsl:call-template name="last-segment"><xsl:with-param name="path" select="substring-after($path,'/')"/></xsl:call-template>
    </xsl:when>
    <xsl:when test="contains($path,'.html')">
      <xsl:value-of select="translate(substring-before($path,'.html'),'-_','  ')"/>
    </xsl:when>
    <xsl:otherwise><xsl:value-of select="translate($path,'-_','  ')"/></xsl:otherwise>
  </xsl:choose>
</xsl:template>

<xsl:template name="label-page">
  <xsl:param name="url"/>
  <xsl:variable name="path" select="substring-after($url,'https://srilexbuditra.work/')"/>
  <xsl:choose>
    <xsl:when test="$url='https://srilexbuditra.work/'">Beranda</xsl:when>
    <xsl:when test="contains($path,'/project-detail.html')">
      <xsl:call-template name="last-segment"><xsl:with-param name="path" select="substring-before($path,'/project-detail.html')"/></xsl:call-template>
      <xsl:text> - Project Detail</xsl:text>
    </xsl:when>
    <xsl:when test="contains($path,'/detail.html')">
      <xsl:call-template name="last-segment"><xsl:with-param name="path" select="substring-before($path,'/detail.html')"/></xsl:call-template>
      <xsl:text> - Detail</xsl:text>
    </xsl:when>
    <xsl:otherwise>
      <xsl:call-template name="last-segment"><xsl:with-param name="path" select="$path"/></xsl:call-template>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

<xsl:template name="section">
  <xsl:param name="entries"/>
  <xsl:param name="id"/>
  <xsl:param name="heading"/>
  <xsl:param name="description"/>
  <xsl:param name="tag"/>
  <xsl:if test="count($entries) &gt; 0">
    <section class="section" id="{$id}">
      <div class="section-head">
        <div><p class="eyebrow"><xsl:value-of select="$tag"/></p><h2><xsl:value-of select="$heading"/></h2><p class="section-sub"><xsl:value-of select="$description"/></p></div>
        <span class="section-count"><xsl:value-of select="count($entries)"/> halaman</span>
      </div>
      <div class="gallery">
      <xsl:for-each select="$entries"><xsl:sort select="s:loc"/>
        <article class="card">
          <a class="card-link" href="{s:loc}">
            <div class="media"><img src="{image:image[1]/image:loc}" alt="Pratinjau halaman" loading="lazy" decoding="async"/></div>
            <div class="card-body">
              <span class="card-category"><xsl:value-of select="$tag"/></span>
              <xsl:variable name="cardTitle"><xsl:call-template name="label-page"><xsl:with-param name="url" select="s:loc"/></xsl:call-template></xsl:variable><h3 title="{$cardTitle}"><xsl:value-of select="$cardTitle"/></h3>
              <p class="card-url"><xsl:value-of select="s:loc"/></p>
              <span class="open">Kunjungi halaman</span>
            </div>
          </a>
        </article>
      </xsl:for-each>
      </div>
    </section>
  </xsl:if>
</xsl:template>

<xsl:template match="/">
<html lang="id">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="theme-color" content="#06182b"/>
  <title>Peta Situs | Srilex Buditra</title>
  <link rel="stylesheet" href="/sitemap-v12.css"/>
</head>
<body>
  <header class="hero"><div class="wrap">
    <nav class="topnav" aria-label="Navigasi utama">
      <a class="brand" href="/">SRILEX BUDITRA</a>
      <a href="/portfolio/">Portfolio</a>
      <a href="/insights/">Insights</a>
      <a href="/">Beranda</a>
    </nav>
    <div class="hero-inner"><p class="eyebrow">WEBSITE DIRECTORY / SITEMAP V12</p>
      <h1>Jelajahi <span>Srilex Buditra</span></h1>
      <p class="hero-desc">Peta situs resmi, ditampilkan sebagai galeri halaman publik. Pilih kategori untuk menemukan layanan, hasil karya, wawasan, dan program yang relevan.</p>
      <div class="totals"><div><strong><xsl:value-of select="count(s:urlset/s:url)"/></strong><span>Halaman publik</span></div><div><strong><xsl:value-of select="count(s:urlset/s:url/image:image)"/></strong><span>Referensi gambar</span></div></div>
    </div>
    <nav class="quick-nav" aria-label="Kategori sitemap">
      <a href="#halaman">Halaman utama</a>
      <a href="#portfolio">Portfolio</a>
      <a href="#insights">Insights</a>
      <a href="#program">Program</a>
    </nav>
  </div></header>
  <main class="wrap" id="konten">
    <xsl:call-template name="section">
      <xsl:with-param name="entries" select="s:urlset/s:url[not(contains(s:loc,'/portfolio/')) and not(contains(s:loc,'/insights/')) and not(contains(s:loc,'/program/'))]"/>
      <xsl:with-param name="id" select="'halaman'"/><xsl:with-param name="tag" select="'HALAMAN PUBLIK'"/>
      <xsl:with-param name="heading" select="'Halaman Utama &amp; Informasi'"/><xsl:with-param name="description" select="'Profil profesional, layanan, kemampuan teknis, dokumentasi dan kebijakan.'"/>
    </xsl:call-template>
    <xsl:call-template name="section">
      <xsl:with-param name="entries" select="s:urlset/s:url[contains(s:loc,'/portfolio/')]"/>
      <xsl:with-param name="id" select="'portfolio'"/><xsl:with-param name="tag" select="'PORTFOLIO'"/>
      <xsl:with-param name="heading" select="'Portfolio &amp; Studi Kasus'"/><xsl:with-param name="description" select="'Pilihan implementasi website, aplikasi, dan platform digital.'"/>
    </xsl:call-template>
    <xsl:call-template name="section">
      <xsl:with-param name="entries" select="s:urlset/s:url[contains(s:loc,'/insights/')]"/>
      <xsl:with-param name="id" select="'insights'"/><xsl:with-param name="tag" select="'INSIGHTS'"/>
      <xsl:with-param name="heading" select="'Insights &amp; Artikel'"/><xsl:with-param name="description" select="'Catatan arsitektur sistem, proses kerja, dan pengalaman teknis.'"/>
    </xsl:call-template>
    <xsl:call-template name="section">
      <xsl:with-param name="entries" select="s:urlset/s:url[contains(s:loc,'/program/')]"/>
      <xsl:with-param name="id" select="'program'"/><xsl:with-param name="tag" select="'PROGRAM PUBLIK'"/>
      <xsl:with-param name="heading" select="'Program &amp; Panduan'"/><xsl:with-param name="description" select="'Halaman publik program dan panduan perjalanan yang tercantum di sitemap.'"/>
    </xsl:call-template>
  </main>
  <footer><div class="wrap footer-inner"><div><strong>Srilex Buditra</strong><p>Website &amp; Digital Solution</p></div><p>Sitemap XML resmi untuk mesin pencari, ditampilkan dengan antarmuka yang ramah pengunjung.</p><a href="/">Kembali ke beranda</a></div></footer>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
