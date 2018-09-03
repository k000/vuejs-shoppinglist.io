/*
メモ
html側
<buy-list
  v-for="item in items"
  v-bind:key="item.title"
  v-bind:item="item"
  @removeitem = "removeitem(item)"
  @saveedit = "saveTodo"
>
にするとkeyでフォーカスが外れるエラーが起きる。おそらくうまく一意のもにできていない。そのため除外

@clickが値の変更前に呼びだされる。
*/

Vue.component('buy-list',{
  //どれも同じliなんだけど中身は違うのでpropsを使う
  props:['item'],//親コンポーネントからデータを受け取るためにエクスポートされた属性のリスト
  template: `
  <li class="itemlist">
      <input type="checkbox" v-model="item.isChecked" v-on:change="saveitem" />
      <div class="list-area">
        <label v-bind:class="{done:item.isChecked,isedit:item.isedit}">
          {{ item.title }}
          　数量：{{ item.num }}
        </label>
        <input type="text" v-model="item.title" v-bind:class="{isedit:item.isedit}"/>
        <input type="number" min="1" max="30" v-model="item.num" v-bind:class="{isedit:item.isedit}" />
      </div>
      <span>
        <i class="fas fa-edit" @click="_edititem(item)"></i>
        <i class="fas fa-trash-alt" @click="_removeitem(item)"></i>
      </span>
  </li>
  `,
  methods : {
    _removeitem : function(item){
      this.$emit('removeitem',item);
    },
    _edititem : function(item){
      item.isedit = !item.isedit;

      if(!item.isedit){
        this.saveitem();
      }
    },
    saveitem : function(){
      this.$emit('saveedit');
    }
  },
  /*
  https://forum.vuejs.org/t/watch/15493/4
  watch:{
    item:{
      handler: function(newv,oldv){

      },
      deep:true
    }
  },
  */
});

const vm = new Vue({
  el: '#app',
  data: {
    items:[],
    newItemTitle:'',
    buynum:1,//bindさせる
  },
  methods:{
    addTodo:function(newTitle,n){
      if(!this.newItemTitle){
        return;
      }
      this.items.push({
          title:newTitle,
          isChecked:false,
          num:n,
          isedit:false,
      });
      this.newItemTitle = '';
      this.buynum = 1;
      this.saveTodo();
    },
    deleteTodo:function(){
      this.items = this.items.filter(function (item){
        return item.isChecked === false;
      });
      this.saveTodo();
    },
    saveTodo:function(){
      localStorage.setItem('pori-items',JSON.stringify(this.items));
    },
    loadTodo:function(){
      this.items = JSON.parse(localStorage.getItem('pori-items'));
      if(!this.items){
        this.items = [];
      }
    },
    //コンポーネントから呼び出す
    removeitem:function(item){
      this.items.splice(this.items.indexOf(item),1);
      this.saveTodo();
    }
  },
  mounted:function(){
    this.loadTodo();
  },
});
