@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/posts') }}">Post</a> :
@endsection
@section("contentheader_description", $post->$view_col)
@section("section", "Posts")
@section("section_url", url(config('laraadmin.adminRoute') . '/posts'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Posts Edit : ".$post->$view_col)

@section("main-content")

@if (count($errors) > 0)
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="box">
	<div class="box-header">
		
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-8 col-md-offset-2">
				{!! Form::model($post, ['route' => [config('laraadmin.adminRoute') . '.posts.update', $post->id ], 'method'=>'PUT', 'id' => 'post-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'has_videoposter')
					@la_input($module, 'audio_content')
					@la_input($module, 'video_content')
					@la_input($module, 'content')
					@la_input($module, 'status')
					@la_input($module, 'shared')
					@la_input($module, 'featured')
					@la_input($module, 'album_descr')
					@la_input($module, 'has_album')
					@la_input($module, 'has_audiobground')
					@la_input($module, 'shared_post_id')
					@la_input($module, 'has_ytbVideo')
					@la_input($module, 'has_thyme')
					@la_input($module, 'has_audio')
					@la_input($module, 'has_video')
					@la_input($module, 'has_image')
					@la_input($module, 'page_id')
					@la_input($module, 'group_id')
					@la_input($module, 'timeline_user_id')
					@la_input($module, 'user_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/posts') }}">Cancel</a></button>
					</div>
				{!! Form::close() !!}
			</div>
		</div>
	</div>
</div>

@endsection

@push('scripts')
<script>
$(function () {
	$("#post-edit-form").validate({
		
	});
});
</script>
@endpush
