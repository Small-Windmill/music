<template>
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script>
import { getSingerList } from '../../api/singer';
import { ERR_OK } from '../../api/config';
import { Getinitial } from '../../common/js/singerName';
import Singer from '../../common/js/singer';
import ListView from '../../base/listview/listview';

const HOT_NAME = '热门';
const HOT_SINGER_LEN = 10;
export default {
  name: 'singer',
  components: {
    ListView,
  },
  data() {
    return {
      singers: [],
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        res = res.data.response.singerList;
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.singerlist);
          console.log(this.singers);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.singer_mid,
            name: item.singer_name,
            avatar: item.singer_pic,
          }));
        }
        const key = Getinitial(item.singer_name);
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          };
        }
        map[key].items.push(new Singer({
          id: item.singer_mid,
          name: item.singer_name,
          avatar: item.singer_pic,
        }));
      });
      // 为了得到有序列表，我们需要处理map
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      // concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
      return hot.concat(ret);
    },
  },
};

</script>
<style lang="scss" scoped>
// bsrolll 有个条件是 父容器的高度要固定好，子元素的内容撑开它，才能滚动
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
