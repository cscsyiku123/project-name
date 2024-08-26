import { Body, Controller, Inject, Post, Req, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { VideoService } from "./video.service";
import { VideoRequest } from "./entity/video.request";
import { ResponseCodeConstants } from "../common/dto/constants";
import { TResponse } from "../common/dto/tresponse.dto";
import { Role, RoleEnum } from "../common/dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";

@Controller("video")
export class VideoController {
  @Inject()
  private readonly videoService: VideoService;
  @Inject()
  private readonly configService: ConfigService;

  @Post("/findVideoByVideoId")
  async findVideoByVideoId(@Body() videoRequest: VideoRequest) {
    return this.videoService.findVideoByVideoId(videoRequest);
  }

  @Post("/deleteVideoByVideoId")
  // @Roles([Role.LOGIN])
  async deleteVideoByVideoId(@Body() videoRequest: VideoRequest, @Req() req) {
    // videoRequest.authorId = req.user.userId;
    return this.videoService.deleteVideoByVideoId(videoRequest);
  }

  @Post("/findVideoByAuthorId")
  @Role([RoleEnum.USER])
  async findVideoByAuthorId(@Body() videoRequest: VideoRequest, @Req() req) {
    videoRequest.authorId = req.user.userId;
    return this.videoService.findVideoByAuthorId(videoRequest);
  }


  @Post("/findVideoByRecommand")
  // @Roles([Role.LOGIN])
  async findVideoByRecommand(@Body() videoRequest: VideoRequest, @Req() req) {
    videoRequest.authorId = req.user?.userId;
    return this.videoService.findVideoByRecommand(videoRequest);
  }

  @Post("/uploadVideo")
  // @UseInterceptors(FilesInterceptor("files"))
  @UseInterceptors(FileFieldsInterceptor([
    { name: "post", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]))
  @Role([RoleEnum.USER])
  async uploadVideo(@UploadedFiles() files: {
    post?: Express.Multer.File[],
    coverImage?: Express.Multer.File[]
  }, @Body() videoRequest: VideoRequest, @Req() req) {
    console.log(files);
    videoRequest.authorId = req.user.userId;

    videoRequest.playLink = this.configService.get<string>("file.upload.dir") + files.post[0].filename;
    videoRequest.coverImageLink = this.configService.get<string>("file.upload.dir") + files.coverImage[0].filename;
    return this.videoService.uploadVideo(videoRequest).then((result) => {
      return result > 0 ? TResponse.getSuccessResponse() : TResponse.getResponse(ResponseCodeConstants.UPLOAD_FAIL);
    });

  }
}
