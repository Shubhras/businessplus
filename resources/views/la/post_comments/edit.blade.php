@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/post_comments') }}">Post comment</a> :
@endsection
@section("contentheader_description", $post_comment->$view_col)
@section("section", "Post comments")
@section("section_url", url(config('laraadmin.adminRoute') . '/post_comments'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Post comments Edit : ".$post_comment->$view_col)

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
				{!! Form::model($post_comment, ['route' => [config('laraadmin.adminRoute') . '.post_comments.update', $post_comment->id ], 'method'=>'PUT', 'id' => 'post_comment-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'post_id')
					@la_input($module, 'comment_user_id')
					@la_input($module, 'comment')
					@la_input($module, 'seen')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/post_comments') }}">Cancel</a></button>
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
	$("#post_comment-edit-form").validate({
		
	});
});
</script>
@endpush
