<template>
  <div>
    <div class="post">
      <h1 class="article-title">
        <span>{{ psg.title }}</span>
      </h1>
      <div class="article-top-meta">
        <span>
          发布 : 
          <router-link :to="{path: '/search', query: {time: psg.createTime.substr(0,10)}}">
            {{ psg.createTime.substr(0,10) }}
          </router-link>
        </span>
        <span>
          分类 :
          <router-link :to="{path: '/search', query: {category: psg.category}}">
            {{ psg.category }}
          </router-link>
        </span>
        <span>
          浏览 : {{psg.scanTimes + 1}}
        </span>
      </div>
      <div class="article-content">
        <div class="markdown-body" v-html="mdToHtml(psg.content)"></div>
      </div>
      <div class="copy-right">
        <div class="markdown-body" v-html="mdToHtml(copyRight)"></div>
      </div>
      <div class="article-footer">
        <div class="article-meta pull-left">
          <span>
            <i class="iconfont icon-06tags"></i>标签: 
            <span v-for="(tag, tagIndex) in psg.tags" :key="tagIndex" class="span--tag">
              <router-link :to="{path: '/search', query: {tag: tag}}">
                #{{ tag }}
              </router-link>
            </span>
          </span>
        </div>
        <div class="article-meta pull-right">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";

import "@/assets/css/article.scss";

import { copyRight } from "@/vendor/setting";
import Passage from "@/vendor/passage.js";
import Markdown from "@/vendor/markdown.js";

const psgAPI = new Passage();
const mdAPI = new Markdown();

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      psg: {
        createTime: "",
        category: "",
        title: "",
        content: ""
      },
      copyRight: copyRight.replace("??", window.location.href)
    };
  },
  mounted() {
    this.fetchPassages();
  },
  beforeDestroy() {
    this.removeToc();
  },
  watch: {
    id(to, from) {
      if (to === from) return;
      this.copyRight = copyRight.replace("??", window.location.href);
      this.fetchPassages();
    }
  },
  methods: {
    mdToHtml(md) {
      return mdAPI.format(md);
    },
    fetchPassages() {
      this.psg = {
        createTime: "",
        category: "",
        title: "",
        content: ""
      };

      psgAPI
        .search({
          id: this.id,
          isScan: true,
          isTitle: false
        })
        .then(res => {
          this.psg = res;
          mdAPI.mathJax(document.getElementsByClassName("markdown-body"));
          if (document.body.clientWidth >= 768) {
            setTimeout(this.generateToc, 500);
          }
        });
    },
    generateToc() {
      $("#sidebar-toc").empty();
      $("#sidebar-header").empty();
      $("#sidebar-header").append("<span> Table of Contents </span>");
      let sidebar = $("#sidebar"),
        app = $("#app"),
        topBtn = $(".back-to-top");
      app.addClass("sidebar-active");
      sidebar.addClass("sidebar-active");
      if (document.body.clientWidth <= 768) {
        topBtn.attr("style", "right: calc(2rem + 200px);");
      } else {
        topBtn.attr("style", "right: calc(2rem + 250px);");
      }
      topBtn.addClass("sidebar-active");
      $(".markdown-body")
        .find("h2,h3,h4,h5,h6")
        .each(function(i, item) {
          let tag = $(item).get(0).localName;
          let tagID = $(item)
            .text()
            .replace(/\s{2}/g, "");
          $(item).attr("id", tagID);
          $("#sidebar-toc").append(`
          <li class="toc-${tag}">
            <a href="#${tagID}" target="_self">
              ${tagID}
            </a>
          </li>
        `);
        });
    },
    removeToc() {
      $("#sidebar-toc").empty();
      $("#sidebar-header").empty();
      $("#sidebar").removeClass("sidebar-active");
      $("#app").removeClass("sidebar-active");
      $(".back-to-top").attr("style", "");
    }
  }
};
</script>

<style lang="scss" scoped>
.article-top-meta span {
  color: #9e9e9e;
  font-style: italic;
}

.post {
  padding-bottom: 0;
}
</style>
