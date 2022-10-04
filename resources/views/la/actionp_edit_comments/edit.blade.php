@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/actionp_edit_comments') }}">Actionp edit comment</a> :
@endsection
@section("contentheader_description", $actionp_edit_comment->$view_col)
@section("section", "Actionp edit comments")
@section("section_url", url(config('laraadmin.adminRoute') . '/actionp_edit_comments'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Actionp edit comments Edit : ".$actionp_edit_comment->$view_col)

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
				{!! Form::model($actionp_edit_comment, ['route' => [config('laraadmin.adminRoute') . '.actionp_edit_comments.update', $actionp_edit_comment->id ], 'method'=>'PUT', 'id' => 'actionp_edit_comment-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'user_id')
					@la_input($module, 'comment')
					@la_input($module, 'action_plan_id')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/actionp_edit_comments') }}">Cancel</a></button>
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
	$("#actionp_edit_comment-edit-form").validate({
		
	});
});
</script>
@endpush
