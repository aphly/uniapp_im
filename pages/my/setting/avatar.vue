<template>
	<view class="main">
		<view>
			<ul>
				<li>头像</li>
			</ul>
		</view>
	</view>
</template>

<script setup>
	import {reactive} from 'vue'
	import { useUserStore } from '@/store/user'
	const userStore = useUserStore()
	const data = reactive({
				title: '头像',
			})
	
	
</script>

<style>
	
</style>
